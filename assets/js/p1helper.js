//p14C Variables
const environmentID = '2b69f842-a8b5-47b7-b5f9-976699b9e150'; // env ID from p1 console
const baseUrl = 'https://gdc-poc.ping-eng.com/gdc'; //Where this app is hosted --> No trailing slash needed

const workerClientID = '851377b0-1f66-4355-8922-831ca35a0856'; //used to create/manage users
const workerClientSecret = 'O5aUY~Kez~IcaOgfDC9O~Kbe9p1dJ0mrMdhQnAPI~B6fospneJ8Q1FJIItmU_ioL';

const appClientID = 'b6eaef17-4201-4a61-9bf1-83805f778fa4'; //used for enduser logon experience
const appClientSecret ='Esf4_~QAYD-_oTClRTVxM5y3G0Wgoax2-guUbfUl7m3edmnXfoylvIg-~94ekJSd'; //used for out of band transaction approvals

//const agentClientID ='fec0bfde-63b0-4256-bff7-46105dbd2497'; //user for agent/admin logon experience
const agentClientID ='85869232-df1f-4c3b-ade9-180752354e42'; //user for agent/admin logon experience


//haveibeenpwned
const pwnedKey = "2993a27deafa41d0b8456caf96518aa1";
//----------------------------------------------------------------------------------------------------//


const scopes = 'openid profile email address phone p1:update:user p1:read:user p1:reset:userPassword p1:read:userPassword p1:validate:userPassword p1:create:device p1:update:device p1:read:device p1:delete:device p1:update:userMfaEnabled'; // default scopes to request
const responseType = 'token id_token'; // tokens to recieve

const landingUrl = baseUrl + '/index.html'; // url to send the person once authentication is complete
const logoffRedirect = baseUrl + '/index.html'; //redirect after signoff
const redirectUri = baseUrl + '/login.html'; // whitelisted url P14C sends the token or code to
const adminRedirect = baseUrl +'/adminlogon.html'; //redirect uri for admin


const authUrl = 'https://auth.pingone.com';
const apiUrl = 'https://api.pingone.com/v1';

const logoutUrl = authUrl + "/" + environmentID + "/as/signoff?post_logout_redirect_uri=" + logoffRedirect + "&id_token_hint";


var flowId = '';

const regexLower = new RegExp('(?=.*[a-z])');
const regexUpper = new RegExp('(?=.*[A-Z])');
const regexNumeric = new RegExp('(?=.*[0-9])');
const regexSpecial = new RegExp('(?=.*[~!@#\$%\^&\*\)\(\|\;\:\,\.\?\_\-])');
const regexLength = new RegExp('(?=.{8,})');

// simple function to parse json web token
function parseJwt(token) {
    console.log("parseJWT was called");
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
  
  // function to generate random nonce
  
  function generateNonce(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:;_-.()!';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  
  if (!appClientID || !environmentID) {
  
    alert('Be sure to edit js/auth.js with your environmentID and clientId');
  
  }
  
  
  // exJax function makes an AJAX call
  function exJax(method, url, callback, contenttype, payload) {
    console.log('exJax called')
    console.log('ajax (' + url + ')');
    console.log("content type: " + contenttype);
    $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        contentType: contenttype,
        data: payload,
        xhrFields: {
          withCredentials: true
        }
      })
      .done(function(data) {
        console.log(data);
        callback(data);
      })
      .fail(function(data) {
        console.log('ajax call failed');
        console.log(data);   
        $('#warningMessage').text(data.responseJSON.details[0].message);
        $('#warningDiv').show();
      });
  }

  function session(){
    if (Cookies.get('accessToken') && Cookies.get('idToken')) {
      console.log("Cookies exist show logoff button");
      $('#authbutton').text='Logout';
      // document.getElementById('authbutton').innerHTML = '<a href="' + logoutUrl + Cookies.get("idToken") + '">LogOff</a>';
      document.getElementById('authbutton').innerHTML =  '<a onclick="signoff()" class="button">SignOff</a>';

    }
    else {
      console.log("cookies don't exist show login");
      $('#authbutton').text='Login';
      document.getElementById('authbutton').innerHTML = '<a href="' + landingUrl + '" class="button">Login/Open an Account</a>';
    }
  }

  function signoff(){
    let redirect = logoutUrl + "=" + Cookies.get("idToken");
    Cookies.remove('idToken');
    Cookies.remove('accessToken');
    Cookies.remove('userAPIid');
    Cookies.remove('userId');
    Cookies.remove('workerAT');

    console.log("Logout redirect is: "+redirect);
    window.location.replace(redirect);
  }