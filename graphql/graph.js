var { buildSchema } = require('graphql');
var { graphqlHTTP } = require('express-graphql');
const tweetData = require('../db/tweet.json');
const Tweet = require('../models/Tweet');

/**
 * JustAnotherRatherVeryInitialSchema used for this app. This can get more complex
 * depending upon the increasing requirements and complexities in the app
 * 
 * NOTE: The data is fetched from a json files but can be to NoSQL or SQL later.
 * 
 * @todo Integrate MongoDB/PostgresQL into the app
 */
var schema = buildSchema(`
    input TwtInput {
        text: String
        username: String
        location: String
        hashtag: String
        limit: Int = 100
    }
    type Twt {
        id: Int
        text: String
        username: String,
        location: String
    }
    type Mutation {
        addTweet(data: TwtInput): Twt
    }
    type Tweets {
        username: String
        location: String
        hashtag: String
        text: String
        
        byUser:[Twt]
        byLocation:[Twt]
        byHashtag: [Twt]
        byText: [Twt]   
        fetch: [Twt]     
    }
    
    type Query {
        Tweets(text: String, username: String, location: String, hashtag: String, limit: Int): Tweets
    }
`);

/**
 * Base Input class for TWT
 */
class Twt {
    constructor(id, text, username, location, hashtag, limit = 100) {
        this.id = id;
        this.text = text;
        this.username = username;
        this.location = location;
        this.hashtag = hashtag;
        this.limit = limit;
    }
}

/**
 * Base Schema class for Tweets 
 */
class Tweets {
    constructor(username, location, text, hashtag, limit ) {
        this.username = username;
        this.location = location;
        this.hashtag = hashtag;
        this.text = text;
        this.limit = limit;
    }
    byUser() {
        return tweetData.filter(t => t.username === this.username).slice(0, this.limit);
    }
    byLocation() {
        return tweetData.filter(t => t.location.toLowerCase() === this.location.toLowerCase()).slice(0, this.limit);
    }
    byText() {
        return tweetData.filter(t => t.text.includes(this.text)).slice(0, this.limit);
    }
    byHashtag() {
        return tweetData.filter(t => t.text.includes(this.hashtag)).slice(0, this.limit);
    }
    /**
     * Implements `AND` clause
     * 
     * Fetches the matched results by implementing `AND` Clause condition on all provided values. 
     * If values are empty, default all tweets returned. 
     * 
     * @returns Array of matched result if all values are matched
     */
    fetch() {
        var query = [];
        console.log(this);
        if (this.username) { query.push('username'); }
        if (this.location) { query.push('location'); }
        if (this.hashtag) { query.push('hashtag'); }
        if (this.text) { query.push('text'); }
        var results = tweetData.filter(elem => {
            var matched = true;
            for (const key of query) {
                if ('hashtag' == key || 'text' == key) {
                    if (!elem.text.includes(this[key])) {
                        matched = false;
                        break;
                    }
                } else {
                    if (elem[key].toLowerCase() != this[key].toLowerCase()) {
                        matched = false;
                        break;
                    }
                }
            }
            if(matched){
                return elem;
            }
        });
        return results.slice(0, this.limit);
    }
}

async function getTitle(data) {
    const queryResult = await Tweet.add(data, (err, data) => data);
    return queryResult
}

// The rootValue provides a resolver function for each API endpoint
var query = {
    Tweets: ({ username, location, text, hashtag, limit }) => new Tweets(username, location, text, hashtag, limit ),
    addTweet: ({ data }) => getTitle(data)
};

var rootQuery = graphqlHTTP({
    schema: schema,
    rootValue: query,
    graphiql: true,
});

module.exports = rootQuery;