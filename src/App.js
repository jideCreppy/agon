import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import {Switch, BrowserRouter as Routers, Router, Link} from "react-router-dom";

let displayResult = {
  display: "inherit",
  marginTop: "2px"
};

let hideResult = {
  display: "none"
};

let selectFilter = {
  marginTop:"7px",
  width:"30%"
}

let controller,signal

const SearchResults = ({ articles }) => (
  <div className="content search-result">
    {articles.map((article, i) => (
      <div key={i} className="search-result-item animated fadeIn">
        <a
          href={article.url}
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: "gray" }} >
          <div
            className="search-thumbnail"
            style={{
              backgroundImage: `url(${article.urlToImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "10px"
            }}
            title={article.source.name}></div>
          <small>{article.title.substring(0, 10).toLowerCase() + "..."}</small>
        </a>
      </div>
    ))}
  </div>
);

const FilterSearch = ({ filterSourceNames, updateSources }) => {
  return (
    <div style={selectFilter}>
      <div className="field">
        <div className="control">
          <select className="select is-small" onChange={updateSources}>
            <option value="filterLabel">Filter Results</option>
              {filterSourceNames.map((result, i) => (
                <option key={i} value={result}>
                {result}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

class App extends React.Component {

  state = {
    apiResults: [],
    filterResults: [],
    totalResults: "",
    loading: false,
    filterSourceNames: [],
    keywords: ''
  };

  filterSourceNames = apiResults => {
    let sources = apiResults.map(result => {
      return result.source.name;
    });

    sources = [...new Set(sources)];

    this.setState({
      filterSourceNames: sources
    });
  }

  updateSources = e => {

    if(e.target.value === "filterLabel"){
      this.setState({
        apiResults: this.state.filterResults
      });
      return
    }
    let target = this.state.filterResults;
    let filteredSources = target.filter(result => {
      return result.source.name === e.target.value;
    });
    this.setState({
      apiResults: filteredSources
    });
  };

 beginSearch = async e => {

    e.preventDefault();

    if (controller !== undefined) {
      this.abortFetching();
    }

    if("AbortController" in window) {
       controller = new AbortController()
       signal = controller.signal
    }

    this.setState({
      loading: true,
      keywords: this.search.value
    });


    await fetch(
      `https://newsapi.org/v2/top-headlines?q=${this.search.value}&category=sports&pageSize=10&apiKey=f908b2c35b3e4981b5151bc85522f954`, 
      {
        method: 'get',
        signal: signal,
      })
      .then(data => data.json())
      .then(data => {
        this.setState({
          apiResults: data.articles ? data.articles : [],
          totalResults: data.totalResults,
          filterResults: data.articles,
          loading: false,
        });

        this.filterSourceNames(this.state.apiResults);
      })
      .catch( error => {
        console.log(`Error: ${error}`)
      })
  }

  abortFetching = () => {
    controller.abort();
  }
  

  render() {
    return (
      <React.Fragment>
        <Routers>
          <header>
          <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <div className="nav-logo-parent">
              <div className="logo">Agon <sup style={{fontSize: "12px"}}>strength, dedication & power.</sup></div>
            </div>
            <div className="nav-links-parent">   
              <ul className="nav-links">  
                <li><Link to="home">Home</Link></li>
                <li><Link to="about">About</Link></li>
                <li><Link to="latest">Latest</Link></li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
    <section className="image-showcase">
      <figure className="reflection"></figure>
      <figcaption>
        <h1 className="caption-header">Photo by Supremelysab. unsplash.com </h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </figcaption>
    </section>
    <section class="search-form">
        <div className="card no-shadow animated bounceInRight delay-1s">
          <header className="card-header">
            <p className="card-header-title">
              <span className="tag is-success">
                <i
                  className="far fa-newspaper"
                  style={{ marginRight: "5px" }}>

                </i>
                 Latest sports news
              </span>
            </p>
          </header>
          <div className="card-content">
            <div className="content">
              <input
                className="input"
                maxLength="50"
                type="text"
                placeholder="keyword"
                ref={search => this.search = search}
                onChange={this.beginSearch}/>
              <FilterSearch
                filterSourceNames={this.state.filterSourceNames}
                updateSources={this.updateSources}/>
              <p style={{ textAlign: "center", fontSize:"14px" }}>
                {this.state.loading ? "Loading..." : ""}
              </p>
            </div>
          </div>
          <footer className="card-footer">
            <small className="search-api-info">
              Live api calls via newapi.org.{" "}
              <i className="fab fa-facebook-square"></i>{" "}
              <i className="fab fa-twitter-square"></i>{" "}
              <i className="fab fa-instagram"></i>{" "}
              <i className="fab fa-youtube"></i>{" "}
            </small>
          </footer>
        </div>
        <div
          className="card no-shadow"
          style={this.state.totalResults > 0 ? displayResult : hideResult}>
          <div className="card-content">
            <SearchResults articles={this.state.apiResults} />
          </div>
        </div>
        </section>
      </main>
      </Routers>
      </React.Fragment>
    );
  }
}

export default App;
