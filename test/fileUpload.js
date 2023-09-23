const axios = require("axios").default;
const FormData = require('form-data');
const fs = require("fs");

const filename = "fotiko.png"
const title = "Arduino BB";
const subtitle = "Projecto 4to Arduino, no se que mas";

const formData = new FormData();

formData.append('media', fs.createReadStream(filename));

axios.postForm(
    `http://192.168.1.153:9008/api/media/new?filename=${filename}&title=${title}&subtitle=${subtitle}`,
    formData,
    {
        headers: {
            ...formData.getHeaders(),
            "auth-token": "d70348d35a2cd42a080794f05695bbec"
        }
    }
)
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.error(error.response);
});