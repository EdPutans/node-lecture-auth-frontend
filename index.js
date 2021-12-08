const host = `http://localhost:3000/`

const getToken = () => {
    const token = window.localStorage.getItem('token');
    if(!token) return null;
    if(token === 'undefined') return null;
    return token;
}

const apiCall = async (body, endpoint, method) => { 
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const token = getToken()
    if(token) headers['Authorization'] = token;

   return fetch(`http://localhost:3000/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    })
    .then(res => res.json())
    .catch(err => setErrorMessage(err));
  };

const register = async () => {
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    
    const result =  await apiCall({ username, password}, 'register', "POST" );

    if(result?.error) {
        setSuccessMessage("");
        setErrorMessage(result.error)
    } else {
        setSuccessMessage(result.message);
        setErrorMessage("");
    }
};

const login = async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const result = await apiCall({ username, password }, 'login', "POST");
    await window.localStorage.setItem('token', result.token);

    result.error ? setErrorMessage(result.error) : handleSuccessfulLogin(result.code);
};


const getCode = async () => {
    if(!getToken()) return;

    const result = await apiCall('', 'code', "GET");
    result.error ? setErrorMessage(result.error) : handleSuccessfulLogin(result.code);
};

const setErrorMessage = (error) => {
    const errorMsgEl = document.getElementById('error-msg');
    errorMsgEl.innerText = error? `Oeuf, something wrong: ${error}` : ""
};

const setSuccessMessage = (message) => {
    const messageEl = document.getElementById('result');
    messageEl.innerText =  message;
};

const handleSuccessfulLogin = (code) => {
    document.getElementById('nuclear-code').innerText = code;
    document.querySelector('form').style.display = 'none';
    document.querySelector('footer').style.display = 'block';
    document.getElementById('code-title').innerText = "Enjoy, mon chéri!"

    setErrorMessage("");
};


const logout = async () => {
    await window.localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// get code on load
getCode();
