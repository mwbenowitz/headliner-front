import React from 'react';
import {Helmet} from 'react-helmet';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import Datetime from 'react-datetime';
import moment from 'moment';
import InputRange from 'react-input-range';
import apiVar from './../config.json';
import Waypoint from 'react-waypoint';

import Article from './article';

var validDate = function(current){
    var startDate = moment('2018-02-23');
    return current.isAfter(startDate)
}

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            startDate: moment('2018-02-23'),
            endDate: moment(),
            searchTerm: '',
            message: '',
            total: 0,
            displayCount: 12,
            articles: [],
            filteredArticles: [],
            displayArticles: [],
            sources: [],
            filters: {"sources": []},
            activeSources: {},
            filterScores: {min: 0, max: 0},
            scoreRange: {min: 0, max: 100},
            sorts: [],
            activeSort: '',
            scrollWatcher: null,
            isLoading: false,
            searchComplete: false,
            loadingArticles: false
        }
        this.updateSearch = this.updateSearch.bind(this);
        this.searchHeadlines = this.searchHeadlines.bind(this);
        this.parseArticles = this.parseArticles.bind(this);
        this.filterArticles = this.filterArticles.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.execFilters = this.execFilters.bind(this);
        this.setScoreFilter = this.setScoreFilter.bind(this);
        this.sortArticles = this.sortArticles.bind(this);
        this._sorter = this._sorter.bind(this);
        this.loadMoreArticles = this.loadMoreArticles.bind(this);
    }

    updateSearch(event){
        this.setState({searchTerm: event.target.value});
    }

    parseArticles(sources){
        var parsed = [];
        var tmpSources = {};
        var actSources = {};
        var scoreRange = {"min": 1000, "max": 0}
        var dateOptions = {"weekday": "short", "year": "2-digit", "month": "2-digit", "day": "2-digit", "hour": "numeric", "minute": "numeric", "hour12": true}
        for(var source in sources){
            var source_name = sources[source]['name'];
            for(var i in sources[source]['articles']){
                var currentArt = sources[source]['articles'][i];
                var firstDate = new Date(currentArt['firstSeen']);
                currentArt['firstSeen'] = firstDate.toLocaleDateString('en-US', dateOptions);
                var lastDate = new Date(currentArt['lastSeen']);
                currentArt['lastSeen'] = lastDate.toLocaleDateString('en-US', dateOptions);
                currentArt["source"] = source_name;
                parsed.push(currentArt);
                if(source_name in tmpSources){
                    tmpSources[source_name] += 1;
                } else {
                    tmpSources[source_name] = 1;
                }
                if(currentArt['avgScore'] < scoreRange['min']){
                    scoreRange['min'] = Math.floor(currentArt['avgScore']);
                }
                if(currentArt['avgScore'] > scoreRange['max']){
                    scoreRange['max'] = Math.ceil(currentArt['avgScore']);
                }
            }
            actSources[source_name] = false;
        }
        this.setState({scoreRange: scoreRange, filterScores: scoreRange})
        this.setState({activeSources: actSources});
        this.setState({sources: tmpSources});
        this.setState({articles: parsed});
        this.setState({filteredArticles: parsed, displayArticles: parsed.slice(0, this.state.displayCount)});

    }

    searchHeadlines(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({isLoading: true, displayCount: 24})
        Axios.get(apiVar.url, {
			params: {"headline": this.state.searchTerm}
		})
			.then(response => {
                this.parseArticles(response.data.articles);
                this.setState({isLoading: false, searchComplete: true, total: response.data.total})
			})
			.catch( error => {
				console.log('API call failed', error);
				this.setState({
					message: error
				});
			});
    }


    filterArticles(addFilter){
        var filters = this.state.filters;
        var actSources = this.state.activeSources;
        console.log(addFilter);
        if(addFilter[0] == 'source'){
            if(filters["sources"].indexOf(addFilter[1]) > -1){
                var removeFilter = filters["sources"].indexOf(addFilter[1]);
                filters["sources"].splice(removeFilter, 1);
                actSources[addFilter[1]] = false;
            } else {
                filters["sources"].push(addFilter[1]);
                actSources[addFilter[1]] = true;
            }
            this.setState({activeSources: actSources}, () =>{
                this.execFilters(filters)
            });
        } else if(addFilter[0] == 'startDate'){
            var startValue = '';
            if(addFilter[1] == ''){
                startValue = moment('2018-02-23');
            } else {
                startValue = addFilter[1];
            }
            this.setState({startDate: startValue}, () => {
                this.execFilters(filters)
            });
        } else if(addFilter[0] == 'endDate'){
            var endValue = '';
            if(addFilter[1] == ''){
                endValue = moment();
            } else {
                endValue = addFilter[1];
            }
            this.setState({endDate: endValue}, () => {
                this.execFilters(filters)
            });
        } else if(addFilter[0] == 'scores'){
            console.log("hello?", filters);
            this.execFilters(filters);
        }
    }

    execFilters(filters){
        var newFilter = [];
        var rawArticles = this.state.articles;
        if(filters["sources"].length == 0){
            var replSources = this.state.activeSources
            for(var source in replSources){
                replSources[source] = false;
            }
            this.setState({activeSources: replSources});
            var dateFiltered = this.filterByDates(rawArticles, this.state.startDate, this.state.endDate);
            var scoreFiltered = this.filterByScores(dateFiltered, this.state.filterScores);
            this.setState({filteredArticles: scoreFiltered, displayArticles: scoreFiltered.slice(0, this.state.displayCount)});
            return true;
        }

        newFilter = rawArticles.filter((art) => {
            if(filters["sources"].indexOf(art.source) > -1){
                return art;
            }
        });
        var dateFiltered = this.filterByDates(newFilter, this.state.startDate, this.state.endDate);
        var scoreFiltered = this.filterByScores(dateFiltered, this.state.filterScores);
        this.setState({filteredArticles: scoreFiltered}, () => {
            this.sortArticles();
        });

    }

    setStartDate(parseStartDate){
        if(typeof parseStartDate != 'string' || parseStartDate == ''){
            this.filterArticles(['startDate', parseStartDate]);
        }
    }

    setEndDate(parseEndDate){
        if(typeof parseEndDate != 'string' || parseEndDate == ''){
            this.filterArticles(['endDate', parseEndDate]);
        }
    }

    filterByDates(articles, startDate, endDate){
        var filterEnd = Number(endDate.format('X'));
        var filterStart = Number(startDate.format('X'));
        var filtered = articles.filter((art) => {
            var artStart = new Date(art.firstSeen).getTime()/1000;
            var artEnd = new Date(art.lastSeen).getTime()/1000;
            if((artStart > filterStart && artStart < filterEnd) || (artEnd > filterStart && artEnd < filterEnd)){
                return art;
            }
        });
        return filtered;
    }

    filterByScores(articles, scoreRange){
        var lowScore = scoreRange['min']
        var highScore = scoreRange['max']
        var filtered = articles.filter((art) => {
            if(art.avgScore > lowScore && art.avgScore < highScore){
                return art;
            }
        })
        return filtered;
    }

    setScoreFilter(value){
        var scoreRange = this.state.filterScores;
        this.filterArticles(["scores", scoreRange]);

    }

    sortArticles(sort=null){
        if(sort){
            var sortName = sort[0];
            var sortType = sort[1];
            var setSort = this.state.sorts;
            var changed = false;
            console.log(setSort, setSort.length, sortName, sortType)
            if(setSort.length > 0){
                for(var i = 0; i < setSort.length; i++){
                    if(setSort[i][0] == sortName){
                        if(setSort[i][1] != sortType){
                            setSort.splice(i, 1);
                            setSort.push(sort);
                        } else {
                            setSort.splice(i, 1);
                        }
                        changed = true;
                        break;
                    }
                }
                if(changed == false){
                    setSort.push(sort);
                }
            } else {
                setSort.push(sort);
            }
            this.setState({sorts: setSort}, () => {
                this._sorter();
            });
            var active = sortName
            if(sortType == 1){
                active += '-asc';
            } else {
                active += '-desc';
            }
            this.setState({activeSort: active})
        } else {
            this._sorter();
        }

    }

    _sorter(){
        console.log(this.state.sorts);
        var articles = this.state.filteredArticles;
        var sorts = this.state.sorts;
        for(var i = 0; i < sorts.length; i++){
            var sortDir = 1
            var type = sorts[i]
            if(type[1] == 2){
                sortDir = sortDir * -1;
            }
            articles.sort(this._sortProp(type[0], sortDir));
        }
        this.setState({filteredArticles: articles, displayArticles: articles.slice(0, this.state.displayCount)})
    }

    _sortProp(type, sortDir){
        var aSort, bSort;
        return function(a, b){
            if(type == 'firstSeen'){
                aSort = new Date(a.firstSeen).getTime()/1000;
                bSort = new Date(b.firstSeen).getTime()/1000;
            } else if(type == 'score') {
                aSort = parseFloat(a.score);
                bSort = parseFloat(b.score);
            } else {
                aSort = a[type];
                bSort = b[type];
            }
            console.log(a[type], aSort, b[type], bSort);
            return (aSort > bSort) ? sortDir : ((bSort > aSort) ? (sortDir * -1): 0);
        }
    }

    loadMoreArticles(){
        this.setState({loadingArticles: true})
        var newDisplay = this.state.displayCount + 12;
        var newArticles = this.state.filteredArticles.slice(0, newDisplay);
        this.setState({displayCount: newDisplay, displayArticles: newArticles, loadingArticles: false});
    }

    render(){
        return(
            <div>
                <div className={"loadOverlay " + (this.state.isLoading ? '' : 'hidden')}><i className="fa fa-circle-o-notch fa-5x fa-spin"></i></div>
                <div className="container">
                    <Helmet>
                        <title>Headliner</title>
                    </Helmet>

                    <div className="flex-row d-flex justify-content-center text-center">
                        <div className="col-12">
                            <h1 className="homeHeader">Headliner <small>BETA</small></h1>
                            <h6 className="homeSubHeader"><Link className="nav-link" to="/about">About</Link>|<Link className="nav-link" to="/contact">Contact</Link></h6>
                            <h6>Search headlines from <Link to="/about">10 major news sources</Link>. Want to see another site here? <Link to="/contact">Let me know!</Link></h6>
                        </div>
                    </div>
                    <div className="flex-row d-flex justify-content-center text-center">
                        <div className="col-12">
                            <h2>Search</h2>
                        </div>
                    </div>
                    <div className="flex-row d-flex justify-content-center text-center">
                        <div className="col-12 col-sm-6 col-sm-offset-3">
                            <form onSubmit={this.searchHeadlines}>
                                <div className="form-group row">
                                    <input id="mainSearch" className="form-control" type="text" value={this.state.searchTerm} onChange={this.updateSearch} placeholder="Search Headlines (e.g. Trump or olympics)"/>
                                </div>
                                <div className="form-group row justify-content-center text-center">
                                    <button type="submit" className="btn btn-primary" id="headlineButton">Search Headlines</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {(this.state.searchComplete && this.state.articles.length == 0) ? (
                        <div className="row">
                            <div className="col-12 text-center">
                                <h2>No Results Found</h2>
                            </div>
                        </div>
                    ) : (
                        null
                    )}
                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-3" id="filterCol">
                            {this.state.articles.length ? (
                                <div className="stickyEl">
                                    <h2>Filter {this.state.total} Results</h2>
                                    <h4>Sources</h4>
                                    <div className="card">
                                        <ul className="list-group list-group-flush">
                                            {Object.keys(this.state.sources).map((source) =>
                                                <button type="button" className={this.state.activeSources[source] ? 'list-group-item list-item-group-action source-button active-source': "list-group-item list-item-group-action source-button"} onClick={() => this.filterArticles(["source", source])} key={source}>{source} <div className="article-count">{this.state.sources[source]}</div></button>
                                            )}
                                        </ul>
                                    </div>
                                    <h4>Dates</h4>
                                    <div className="card card-no-border">
                                        <div className="card-block">
                                            <h6>From</h6>
                                            <Datetime isValidDate={validDate} onChange={this.setStartDate}/>
                                            <h6>To</h6>
                                            <Datetime isValidDate={validDate} onChange={this.setEndDate}/>
                                        </div>
                                    </div>
                                    <h4>Scores</h4>
                                    <div className="card card-no-border">
                                        <div className="mt-3 card-block">
                                            <div className="row">
                                                <div className="col-12">
                                                    <InputRange
                                                        maxValue={this.state.scoreRange.max}
                                                        minValue={this.state.scoreRange.min}
                                                        value={this.state.filterScores}
                                                        onChangeComplete={value => this.setScoreFilter(value)}
                                                        onChange={value => this.setState({filterScores: value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className="col-sm-12 col-md-8 col-lg-9">
                            {this.state.articles.length > 0 ? (
                                <div id="sortRow" className="stickyEl">
                                    <div className="d-flex flex-row">
                                        <div className="p-2">
                                            <h4>Sort</h4>
                                        </div>
                                        <div className="p-2">
                                            <h6>Headline</h6>
                                            <div className="btn-group" role="group">
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'headline-asc' ? 'active' : '')} onClick={(param) => this.sortArticles(["headline", 1])}><i className="fa fa-sort-alpha-asc"></i></button>
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'headline-desc' ? 'active' : '')} onClick={(param) => this.sortArticles(["headline", 2])}><i className="fa fa-sort-alpha-desc"></i></button>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <h6>Source</h6>
                                            <div className="btn-group" role="group">
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'source-asc' ? 'active' : '')} onClick={(param) => this.sortArticles(["source", 1])}><i className="fa fa-sort-alpha-asc"></i></button>
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'source-desc' ? 'active' : '')} onClick={(param) => this.sortArticles(["source", 2])}><i className="fa fa-sort-alpha-desc"></i></button>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <h6>Score</h6>
                                            <div className="btn-group" role="group">
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'avgScore-asc' ? 'active' : '')} onClick={(param) => this.sortArticles(["avgScore", 1])}><i className="fa fa-sort-numeric-asc"></i></button>
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'avgScore-desc' ? 'active' : '')} onClick={(param) => this.sortArticles(["avgScore", 2])}><i className="fa fa-sort-numeric-desc"></i></button>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <h6>Date</h6>
                                            <div className="btn-group" role="group">
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'firstSeen-asc' ? 'active' : '')} onClick={(param) => this.sortArticles(["firstSeen", 1])}><i className="fa fa-sort-amount-desc"></i> <i className="fa fa-calendar"></i></button>
                                                <button type="button" className={"btn btn-primary btn-sm " + (this.state.activeSort == 'firstSeen-desc' ? 'active' : '')} onClick={(param) => this.sortArticles(["firstSeen", 2])}><i className="fa fa-sort-amount-asc"></i> <i className="fa fa-calendar"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="articleContainerLine"/>
                                </div>
                            ) : (
                                null
                            )}
                            <div className="row">
                                {this.state.displayArticles.map((article) =>
                                    <Article article={article} key={article.uuid}/>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <h6 className={(this.state.loadingArticles ? '' : 'hidden')}><i className="fa fa-circle-o-notch fa-spin"></i> Loading Articles</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Waypoint onEnter={this.loadMoreArticles} topOffset='50px'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
