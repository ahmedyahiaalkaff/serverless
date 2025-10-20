const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_FTQgApHWC",
    client_id: "6g0pb2ii961bdsiq3cd4s21nh8",
    redirect_uri: "http://localhost:5500",
    response_type: "code",
    scope: "email openid phone"
};

// create a UserManager instance
export const userManager = new oidc.UserManager({
    ...cognitoAuthConfig,
});

let guser;
userManager.signinCallback().then(function (user) {
  guser = user;
});

export async function signOutRedirect () {
    const clientId = "6g0pb2ii961bdsiq3cd4s21nh8";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://us-east-1ftqgaphwc.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

document.getElementById("submit").addEventListener("click", async ()=>{
  if(!guser){
    await userManager.signinRedirect();
    return;
  }
  const name = document.getElementById("name").value;
  const params = new URLSearchParams()
  params.append("name", name);

  if(name && name.trim() != ""){
    fetch(`https://se8cv1zjr8.execute-api.us-east-1.amazonaws.com/s1/capitalize?${params}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      method: "GET"
    }).then((response)=>response.json()).then((result)=>{
      console.log(result)
      if(result && result.body && result.body.name){
        console.log(result.body.name)
        document.getElementById("output").value = result.body.name
      }
    })
  }
})