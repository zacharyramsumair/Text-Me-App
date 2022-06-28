
alert(EMAILJS_PUBLICKEY)

(function(){
    emailjs.init("L0x0F6d9Kr61nIZo5");
 })();


function sendMail() {
    let tempParams = {
    // from_name: document.getElementById("fromName").value,
    // to_name: document.getElementById("tolame").value,
    // message: document.getElementById("msg").value,

    from_name :"reincarnatednagisa@gmail.com",
    to_name: "ramsumairzachary@gmail.com",
    message: "cools",
    };

    emailjs.send('gmail, template_vzlu5yi', tempParams)
    .then(function(res){
        console.log('success', res.status)
    })

}


sendMail()