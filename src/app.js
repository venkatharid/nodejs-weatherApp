const path=require('path')
const express= require('express')
const hbs= require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

var app = express();
const port= process.env.PORT || 3000;

//Define paths for Express config
var pathtopublic = path.join(__dirname,'../public');
var veiwPath = path.join(__dirname,'../templates/views');
var partialPath = path.join(__dirname,'../templates/partials');



//setup handlebars engine and views location
app.set("view engine",'hbs')
app.set('views',veiwPath);
hbs.registerPartials(partialPath)

app.use(express.static(pathtopublic))


app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'venkat'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About Me',
        name: 'Venkat'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        name: 'Venkat'
})
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'Please provide address'
        })
    }
    geocode(req.query.address, (error, {latitude,longitude,location}={}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                address: req.query.address,
                location,
                forecastData: forecastData
            })
        })
    })
})

app.get('/help/*',(req,res)=>{
    res.render('error',{
        title: '404 Error',
        name:'Venkat',
        errorMessage:'Help article not found'
    })
})

app.get('/*',(req,res)=>{
    res.render('error',{
        title: '404 Error',
        name:'Venkat',
        errorMessage:'Page not found'
    })
})

app.listen(port,()=>{
    console.log("server is started"+ port)
})