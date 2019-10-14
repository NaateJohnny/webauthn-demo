/* Handle for register form submission */
$('#register').submit(function(event) {
    event.preventDefault();

    let username = this.username.value;
    let name     = this.name.value;

    if(!username || !name) {
        alert('Name or username is missing!')
        return
    }

    getMakeCredentialsChallenge({username, name})
        .then((response) => {
            let publicKey = preformatMakeCredReq(response);
            return navigator.credentials.create({publicKey})
        })
        .then((newCred) => {
            let makeCredResponse = publicKeyCredentialToJSON(newCred)
            console.log(makeCredResponse)
        })

})

let getMakeCredentialsChallenge = (formBody) => {
    return fetch('/webauthn/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    })
    
    .then((response) => {
        let makeCredResponse = publicKeyCredentialToJSON(response);
        return sendWebAuthnResponse(makeCredResponse)
    })
    .then((response) => {
        if(response.status === 'ok') {
            loadMainContainer()   
        } else {
            alert(`Server responed with error. The message is: ${response.message}`);
        }
    })
    .catch((error) => alert(error))
}