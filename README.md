# Setup
How to start application:

## Step 1

In Terminal, run 
```
npm install
``` 
to install all relevent packages /n

## Step 2

In Terminal, run 
```
npm run seed
```
to setup and populate database

## Step 3

In Terminal, run
```
npm start
```
to open server

## Step 4

In different Terminal, run 
```
npm run build
```
to compile with webpack and babel

Open browser to localhost:3001

# API

## Route
/api/graph/stockHistory

### GET
/api/graph/stockHistory?id=[ID]&term=[TERM]

ID = stock ticker, ex 'MSFT'

TERM = ['1D', '1W', '1M', '3M', '1Y', '5Y']

#### Response:
```javascript
{
  tags: ["Top 100", "Technology", "Banking"],
  historicPrice1D: [166.09, …],
  name: "American Express Co",
  symbol: "AMEX",
  analystHold: 0,
  robinhoodOwners: 28513,
  price: 166.09,
}
```
*historicPrice property that matches query term will be returned.


### POST
/api/graph/stockHistory

#### Body Format (JSON):
```javascript
{
  prices: [
    {
      timestamp: '1999-01-08 04:05:00 -8:00',
      symbol: 'MSFT',
      price: 166.09,
    },
    {
      timestamp: '1999-01-08 04:10:00 -8:00',
      symbol: 'MSFT',
      price: 167.19,
    },
  ],
}
```
timestamp will be rounded to nearest 5 minutes

#### Response:
created priceIds
```javascript
{
  createdCount: 2,
}
```


### PUT
/api/graph/stockHistory

#### Body Format (JSON):
```javascript
{
  [
    {
      timestamp: '1999-01-08 04:05:00 -8:00',
      symbol: 'MSFT',
      price: 166.09,
    },
    {
      timestamp: '1999-01-08 04:10:00 -8:00',
      symbol: 'MSFT',
      price: 167.19,
    },
  ]
}
```
timestamp will be rounded to nearest 5 minutes

#### Response:
updated priceIds
```javascript
{
  updatedCount: 2,
}
```


### DELETE
/api/graph/stockHistory

#### Body Format (JSON):
```javascript
{
  {
    startTimestamp: '1999-01-08 04:05:00 -8:00',
    endTimestamp: '1999-01-09 04:05:00 -8:00',
    symbol: 'MSFT',
  },
  {
    startTimestamp: '1999-01-08 04:05:00 -8:00',
    endTimestamp: '1999-01-09 04:05:00 -8:00',
    symbol: 'MSFT',
  },
}
```
timestamp will be rounded to nearest 5 minutes

#### Response:
deleted priceIds
```javascript
{
  deletedCount: 2,
}
```