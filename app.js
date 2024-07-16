

document.addEventListener('DOMContentLoaded', (event) => {
  const today0= new Date().toISOString()
  const today=today0.split('T')[0];
  console.log("today",today)
  const dateip = document.getElementById('due');

  dateip.setAttribute('min', today);

  const currentdate = new Date();
  console.log("currentdate ",currentdate)



  $('#sender').select2();
});

 


var reqname;

//user data
domo.get('/domo/users/v1?includeDetails=true&limit=300').then(function(data) {
  console.log(data);
console.log(domo.env)

  data.forEach((ele) => {
      if (ele.id == (domo.env).userId) {
         
          reqname =ele.displayName
          let img = document.createElement('img');
    img.src =`/domo/avatars/v2/USER/${(domo.env).userId}?size=300&defaultForeground=fff&defaultBackground=000&defaultText=D`;
    img.width=`40`
    img.height=`40`
    img.id=`av`
    document.getElementById('avimg').appendChild(img);
          
      }
  });


  var select = document.getElementById('sender');

  data.forEach(function(ele) {
      var opt = document.createElement('option');
      opt.value = ele.id;
      opt.text = ele.displayName;

      select.appendChild(opt);
  });

  
});


var semail;
function change() {
  document.getElementById("name").value=" ";
  document.getElementById("email").value=" ";
  se = document.getElementById('sender');

  domo.get('/domo/users/v1?includeDetails=true&limit=300').then(function(data){
    console.log(data)


   data.forEach(element => {
    if(se.value==element.id)
    {
      console.log(element.displayName,"\n",element.detail.email)
      document.getElementById("name").value=element.displayName;
      document.getElementById("email").value=element.detail.email;
      semail=element.detail.email;
     
    }
    
   });

  })




 
  
  console.log(se.value)
console.log("hii")
 
  


};






  async function sendMail() {
    console.log("hi venkat");
    let requname='';
    let email='';
    let my_id=(domo.env).userId;
    domo.get('/domo/users/v1?includeDetails=true&limit=300').then(function(data) {
      console.log(data);

      data.forEach(function(ele) {
        if (ele.id == (domo.env).userId) {
          requname = ele.displayName;
          email=ele.detail.email;
          }

      })
      console.log(requname)   
      console.log(email)       
    });    
 
    const startWorkflow = (alias, parms) => {
    domo.post(`/domo/workflow/v1/models/${alias}/start`, parms);
    };

    let opt= document.getElementById('sender');
    let sendername =opt.options[opt.selectedIndex].text;
    let id=opt.value;
    console.log(id)
    console.log(sendername);

    let acnum=document.getElementById('destination').value
    console.log(acnum);


    let syl=document.getElementById('currency').value
    if(syl=='inr')
    {
        sym='₹'
      
    }
    else{
    sym='$'
    }
    console.log(syl)
    console.log(sym)


am=document.getElementById('amount').value
console.log(am);


let comp=document.getElementById('company').value                   
console.log(comp)

let date=document.getElementById('due').value
console.log(date,typeof(date))
let da = new Date(date);
console.log(da,typeof(da))
let year = da.getFullYear();
let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let month = monthNames[da.getMonth()]; 
let day = String(da.getDate()).padStart(2, '0');

let formattedDate = `${month} ${day}, ${year}`;


console.log(formattedDate);

   let html=`<div id="popup"> 
    
  
   
 
       Hi ${sendername}, 

       ${comp} ${reqname},requested <b>${am} ${sym}</b> payment
      
       You need make a payment before <span style="text-decoration: underline;"> <b> ${formattedDate} </b></span>
    
       <span>Thanks, </span> 
       ${reqname}
   
 



     
  </div>`
  console.log((domo.env).userId)
   let sub= `Payment Request from ${comp} ${reqname} `

let ht=`Hi ${sendername}, 

<span>  ${comp} ${reqname},requested <b>${am} ${sym}</b> payment</span>

You need make a payment before <span style="text-decoration: underline;"> <b> ${formattedDate} </b></span>

<span>Thanks, </span> 
${reqname}`
let sb= `Payment Request from ${comp} ${reqname} `



      console.log("hello");
     
      const parms = { person: id, body:  html, subject: sub };
     startWorkflow("workflow1", parms);
      await mail(id); 


     document.getElementById('mail').style.visibility='hidden';
      console.log(requname)

      const a= {"content":{
    
        'requested_by':{
                   name: `${reqname}`,
                   user_id: `${my_id}`
                 },
           'requested_to':{
                   user_id: `${id}`,
                   name:`${sendername}`,
                   user_email: `${semail}`
                 },
          ' contact_details':{
                   name: `${sendername}`,
                   email: `${semail}`
                 },
          ' request_details':{
                     amount:{
                       currency:`${syl}`,
                       amount: `${am}`,
                       due_date: `${formattedDate}`
                       }
                   },
                   company_name: `${comp}`,
                   destination_account: `${acnum}`
                   }
         }
       console.log(a)


         domo.post(`/domo/datastores/v1/collections/PaymentRequestDb/documents/`,a)
         .then(data => console.log(data));






  }
  
  
  async function mail(val) {
    console.log("value",val)
    if (val !== ''){

    const data = await domo.get('/domo/users/v1?includeDetails=true&limit=300'); 
    console.log(data);
  

    data.forEach((ele) => {
      console.log("inside sendmailbutton");
  
      let s = document.getElementById('sendVerfiy');
      if (s.style.visibility !== 'visible') {
        s.style.visibility = 'visible';
      }
  
      if (ele.id == val) {
        document.getElementById("sendVerfiy").innerHTML = "Send Mail Successfully to " + ele.displayName +" "+"<span style='font-size:20px;'>&#9989;</span>"
        
      
      }
    });
  }

  else{
    console.log("Invalid")
    document.getElementById("valid").innerHTML='<span>Please Fill All Values</span>'
  }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  function clr()
  {
    console.log("clear")
    document.getElementById("sendVerfiy").textContent = " ";
    document.getElementById("sendVerfiy").style.visibility="hidden"
    document.getElementById("valid").textContent='';
    document.getElementById("valid").style.visibility="hidden"
  }
  

  console.log(domo.env);

  document.addEventListener('DOMContentLoaded', function() {
   
    function rese() {

      document.getElementById('myForm').reset();
    }

    
    document.getElementById('res').addEventListener('click', rese());
  });



























  function request() { 
    let opt= document.getElementById('sender');
    let id=opt.value;
    console.log(typeof(id))

    am=document.getElementById('amount').value
  console.log(am);
  
  
  let comp=document.getElementById('company').value                   
  console.log(comp)
  
  let date=document.getElementById('due').value
  console.log(date,typeof(date))
  let acnum=document.getElementById('destination').value
    console.log(acnum);

    if( typeof id === "string" && id.length !== 0 && typeof am === "string" && am.length !== 0 && typeof comp === "string" && comp.length !== 0 &&typeof date === "string" && date.length !== 0 &&  typeof acnum === "string" && acnum.length !== 0)

      {
        console.log(id)
    req=document.getElementById('mail');
    
    console.log("insiderequest button");
    if(req.style.visibility!='visible')
    {
      req.style.visibility='visible'
      console.log("inside IF");


      console.log("hi venkat");
      let requname='';
      domo.get('/domo/users/v1?includeDetails=true&limit=300').then(function(data) {
        console.log(data);
  
        data.forEach(function(ele) {
          if (ele.id == (domo.env).userId) {
            requname = ele.displayName;
            }
  
        })
        console.log(requname)          
      });    
   
      
  
      let opt= document.getElementById('sender');
      let sendername =opt.options[opt.selectedIndex].text;
      console.log(sendername);
  
  
      let syl=document.getElementById('currency').value
      if(syl=='inr')
      {
          sym='₹'
        
      }
      else{
      sym='$'
      }
      console.log(syl)
      console.log(sym)
  
  
  
  da = new Date(date);
  console.log(da,typeof(da))
  let year = da.getFullYear();
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let month = monthNames[da.getMonth()]; 
  let day = String(da.getDate()).padStart(2, '0');
  
  let formattedDate = `${month} ${day}, ${year}`;
  
  
  console.log(formattedDate);
  
     
  let ht=`Hi ${sendername}, <br><br>
  
  <span> ${comp} ${reqname},requested <b>${am} ${sym}</b> payment</span> <br><br>
  
  You need make a payment before <span style="text-decoration: underline;"> <b> ${formattedDate} </b></span>
  <br><br>
  <span>Thanks, </span> <br> 
  ${reqname}`
  let sb= `Payment Request from ${comp} ${reqname} `
  
  
  
        console.log("hello");
        document.getElementById('popup').innerHTML="Sub: "+sb+"<br> <br>"+ht;
   
  
  
        // document.getElementById("name").value=`${sendername}`
        // document.getElementById("email").value="";
       
        console.log(requname)

   }
    else{
      req.style.visibility='hidden'
      console.log("inside else");
    }


  }


  else{
     console.log("Invalid")
    //  alert('Please Fill All details')
     let va =  document.getElementById("valid");
      if (va.style.visibility !== 'visible')
      {
        va.style.visibility = 'visible'
        document.getElementById("valid").innerHTML='<span>Please Give All Details</span>'
      }
  }
    
  }

 



