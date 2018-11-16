var mySql= require('mysql');
var express= require('express');
var bodyparser=require('body-parser');
var urlencoded=bodyparser.urlencoded({extended:false});
var app=express();
var connection= mySql.createConnection({host:'localhost',user:'root',password:'password',database:'healthcaresystem'});
app.set('view engine','ejs');

connection.connect(function (err) {
  if(err){
    throw err;
  }
  else {
    console.log('the connection has been made with the database');
  }
});

app.post('/index',urlencoded,function (req,res) {
  var sql= "INSERT INTO Patient (email_id, password, first_name, middle_name, last_name, date_of_birth, phone_number, blood_group, medical_history) VALUES ('"+req.body.emailid+"', '"+req.body.password+"','"+req.body.firstname+"','"+req.body.middlename+"','"+req.body.lastname+"','"+req.body.dateofbirth+"','"+req.body.phonenumber+"','"+req.body.bloodgroup+"','"+req.body.medicalhistory+"')";
  connection.query(sql,function(err,result){
    if(err) throw err;
    res.render('index');
  })

});

app.get('/index',function(req,res){
  res.render('index')
});

app.get('/register',urlencoded,function(req,res){

  res.render('register');
});

app.get('/login',function(req,res){

  res.render('login');
});

app.get('/doclogin',function(req,res){
  res.render('doclogin')
})

app.get('/welcome',function(req,res){
  res.render('welcome');
});




var obj = {};
app.post('/patient', function(req, res){

    connection.query('SELECT * FROM Patient', function(err, result) {

        if(err){
            throw err;
        } else {
            obj = {print: result};
            res.render('patient', obj);
        }
    });

});

app.get('/slot',function(req,res){
connection.query('SELECT * from qualification',function(err,result){
  if(err){
      throw err;
  } else {
      obj = {print: result};
      res.render('slot', obj);
  }
})
});

app.post('/lookup',urlencoded,function(req,res){
  /*var query=
  console.log(req.body.qualification);
  res.send('done');*/
  var sql = "select concat(d.first_name,' ',d.last_name) as 'full_name', concat_ws(',',d.address_line1,d.address_line2,d.city,d.state,d.zipcode) as Address, d.phone_number from doctor d inner join doctorqualification dq using(doctor_id)inner join qualification q using(qualification_id) where qualification_name='"+req.body.qualification+"'"
  connection.query(sql,function(err,result){
    if(err) throw err;
    res.render('lookup',{print:result})
  })
})

app.post('/doctor', function(req, res){

    connection.query('SELECT * FROM doctor', function(err, result) {

        if(err){
            throw err;
        } else {
            obj = {print: result};
            res.render('doctor', obj);
        }
    });

});
app.post('/pat', urlencoded,function(req, res){

    connection.query('SELECT * FROM Patient where patient_id ='+req.body.input+' ', function(err, result) {

        if(err){
            throw err;
        } else {
            obj = {print: result};
            res.render('pat', obj);
        }
    });

});

app.post('/success',urlencoded,function(req,res){
  var sql="SELECT * from Patient where email_id ='"+req.body.emailid+"' AND password='"+req.body.password+"' "
  //console.log(sql);
  connection.query(sql,function(err,result){
    if(err) throw err;
    //console.log(result);
    res.render('success')
  })
});

app.post('/dochome',urlencoded,function(req,res){
  console.log(req.body.emailid);
  var sql="SELECT * from Doctor where email_id ='"+req.body.emailid+"' AND password= '"+req.body.password+"' "
  connection.query(sql,function(err,result){
    if(err) {
      throw err;
    }else{
    //console.log(result);
    res.render('dochome',{result:result})
  }
  })
});

app.post('/message',urlencoded,function(req,res){
  var sql="select concat_ws(' ',p.first_name,p.last_name) as 'Patient_name',m.message_content from message m inner join patient p using(patient_id) inner join doctor d using(doctor_id) where d.email_id='"+req.body.emailid+"'"
  connection.query(sql,function(err,result){
    if(err) {
      throw err;
    }else{
    console.log(result);
    res.render('message',{result:result});
  }
  })
})

app.get('/searchslots',function (req,res) {

  res.render('searchslots')
});

app.post('/viewslots',urlencoded,function(req,res){
  console.log(req.body.doctorname);
  var sql = "select available_time, status from AppointmentSlot inner join TimeSlot using (slot_no) inner join doctor using (doctor_id) where first_name = '"+req.body.doctorname+"' "
  connection.query(sql,function(err,result){
    if(err) {
      throw err;
    }else{
    console.log(result);
    res.render('viewslots',{result:result});
  }
  })
})



app.listen(8080,'127.0.0.1');
