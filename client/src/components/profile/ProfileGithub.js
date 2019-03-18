import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

class ProfileGithub extends Component {
  constructor(props){
    super(props);
    this.state = {
      clientId: '9ab859e4316a5af1a664',
      clientSecret: 'eb6b1b3291fb7baa3751b6af8027e491954e7c1a',
      count: 5,
      sort: 'created: asc',
      repos: []
    }
  }

  componentDidMount(){
    const { githubusername } = this.props;
    const { count, sort, clientId, clientSecret} = this.state;
    
    fetch(`https://api.github.com/users/${githubusername}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res => res.json())
      .then(data => {
        if(this.refs.myRef){
          this.setState({repos: data});
        }
      })
      .catch(err => console.log(err));
  }

  render() {

    const { repos } = this.state;
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>
              {repo.description}
            </p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>

            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>

            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ))
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    )
  }
}

ProfileGithub.propTypes = {
  githubusername: propTypes.string.isRequired
}

export default ProfileGithub;
