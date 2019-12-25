import React from "react";
import logo from "./logo.svg";
import "./App.css";

let displayResult = {
  display: "inherit",
  marginTop: "10px"
};

let hideResult = {
  display: "none"
};

let selectFilter = {
  marginTop:"5px"
}

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
          <select className="select is-primary" onChange={updateSources}>
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
  constructor(props) {
    super(props);

    this.state = {
      apiResults: [],
      backUpResults: [],
      totalResults: "",
      loading: false,
      filterSourceNames: []
    };

    this.beginSearch = this.beginSearch.bind(this);
    this.filterSourceNames = this.filterSourceNames.bind(this);
    this.updateSources = this.updateSources.bind(this);
  }

  filterSourceNames(apiResults) {
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
        apiResults: this.state.backUpResults
      });
      return
    }
    let target = this.state.backUpResults;
    let filteredSources = target.filter(result => {
      return result.source.name === e.target.value;
    });
    this.setState({
      apiResults: filteredSources
    });
  };

  beginSearch(e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    fetch(
      `https://newsapi.org/v2/top-headlines?q=${e.target.value}&category=sports&pageSize=12&apiKey=f908b2c35b3e4981b5151bc85522f954`
    )
      .then(data => data.json())
      .then(data => {
        this.setState({
          apiResults: data.articles ? data.articles : [],
          totalResults: data.totalResults,
          backUpResults: data.articles,
          loading: false
        });

        this.filterSourceNames(this.state.apiResults);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="card no-shadow animated bounceInRight delay-2s">
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
                onChange={this.beginSearch}/>
              <FilterSearch
                filterSourceNames={this.state.filterSourceNames}
                updateSources={this.updateSources}/>
              <p style={{ textAlign: "center" }}>
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
      </React.Fragment>
    );
  }
}

export default App;
