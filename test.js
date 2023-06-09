const { UserMedia, Media } = require("./media");


const adri = new UserMedia("adriabama06");

console.log(adri.media);

adri.appendMedia(new Media("hola.png", 0, 10));

console.log(adri.media);
