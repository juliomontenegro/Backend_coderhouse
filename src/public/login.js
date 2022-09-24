const login = async()=>{
    let email=document.getElementById('email');
    let password=document.getElementById('password');

    let response=await fetch('/api/sessions/login',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email:email.value,
            password:password.value
        })
    });
    let data=await response.json();
    if(data.status=="success"){
        location.reload()
    }
    return data;

}