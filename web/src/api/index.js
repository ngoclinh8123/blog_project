import Cookies from 'universal-cookie'
import axios from 'axios'

const cookie= new Cookies()
const token=cookie.get('token')

function get_data(url,token="") {
    let headers;
    if (token === "" || token===undefined) {
      headers = {
        "Content-Type": "application/json",
      };
    } else {
      headers = {
        Authorization: `JWT ${token}`,
        "Content-Type": "application/json",
      };
    }
    return axios
      .get(url, { headers: headers })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // console.error(error);
    });
  }


function post_data_with_token(url,data,token) {
    axios.post(url, data, {
        headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json',
        },
    })
    .then(response => {
        console.log(response.data)
    })
    .catch(error => {
        // console.error(error);
    });
}

function post_data_no_token(url,data) {
    axios.post(url, data, {
        headers: {
        'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error(error);
    });
}




export {get_data,post_data_no_token,post_data_with_token}

