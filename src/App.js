import React from "react";
import logo from "./logo.svg";
import "./App.css";


let displayResult = {
  display: "inherit",
  marginTop: "40px"
}

let hideResult = {
  display: "none"
}

const SearchResults = ({ articles }) => 
  <div className="content search-result">
    {articles.map((article, i) => (
      <div key={i} className="search-result-item">
        <a href={article.url} target="_blank">
          <div
            className="search-thumbnail"
            style={{ backgroundImage: `url(${article.urlToImage})`, backgroundSize:"cover", backgroundPosition:"center"}}
            title={article.source.name}>
           </div>
          <small>{article.title.substring(0,10) + "..."}</small>
        </a>
      </div>
    ))}
  </div>


class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      apiResults: [],
      totalResults: "",
      loading: false
    };

    this.beginSearch = this.beginSearch.bind(this);
  }

  beginSearch(e) {

    e.preventDefault();

    this.setState({
      loading: true
    })

    fetch(
      `https://newsapi.org/v2/top-headlines?q=${
        e.target.value
      }&category=sports&pageSize=12&apiKey=f908b2c35b3e4981b5151bc85522f954`
    )
      .then(data => data.json())
      .then(data => {
        console.log(data)
        this.setState({
          apiResults: data.articles ? data.articles : [],
          totalResults: data.totalResults,
          loading: false
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="card animated bounceInRight delay-2s">
          <header className="card-header">
            <p className="card-header-title"><span className="tag is-success"> <i className="far fa-newspaper" style={{marginRight:"5px"}}></i> {"  "} Latest sports news</span> </p>
          </header>
          <div className="card-content">
            <div className="content">
              <input
                className="input"
                maxLength="50"
                type="text"
                placeholder="keyword"
                onChange={this.beginSearch}
              />
               <p style={{ textAlign:"center"}}>{this.state.loading ? 'Loading...' : ''}</p>
            </div>
          </div>
          <footer className="card-footer">
            <small className="search-api-info">
              Live api calls via newapi.org
            </small>
          </footer>
        </div>
        <div className="card" style={this.state.totalResults > 0 ? displayResult: hideResult}>
          <div className="card-content">
            <SearchResults articles={this.state.apiResults} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
