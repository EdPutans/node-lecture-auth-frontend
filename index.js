const host = `http://localhost:3000/`

const apiCall = async (body, endpoint, method) => {
    const token = await window.localStorage.getItem('token');
      
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const authorization = token && token !== 'undefined' ? `${token}` : "";
    if(authorization) headers['Authorization'] = authorization;

    const result = await fetch(`http://localhost:3000/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    })
    
   return result.json();
};

const register = async () => {
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    
    const result =  await apiCall({ username,password,}, 'register', "POST" );
    await window.localStorage.setItem('token', result.token);
    result.error ? setErrorMessage(result.error) : setSuccessMessage(result.message);
};

const login = async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const result = await apiCall({ username,password }, 'login', "POST");
    await window.localStorage.setItem('token', result.token);

    result.error ? setErrorMessage(result.error) : loginSuccess(result.codes);
};


const getCodes = async () => {
    if(!window.localStorage.getItem('token')) return;

    const result = await apiCall(undefined, 'codes', "GET");
    result.error ? setErrorMessage(result.error) : loginSuccess(result.codes);
};

const setErrorMessage = (error) => {
    const errorMsgEl = document.getElementById('error-msg');
    errorMsgEl.innerText = error? `Oeuf, something wrong: ${error}` : ""
};

const setSuccessMessage = (message) => {
    const messageEl = document.getElementById('result');
    messageEl.innerText =  message;
    clearError();
};

const loginSuccess = (codes) => {
    document.getElementById('codes-title').innerText = "Enjoy, mon chéri!"
    document.getElementById('nuclear-codes').innerText = codes.join(' \n ');
    document.querySelector('form').style.display = 'none';
    clearError();
};

const clearError = () => setErrorMessage("");

const logout = async () => {
    await window.localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// get codes on load
getCodes();
