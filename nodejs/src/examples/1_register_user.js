"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fynal_1 = require("fynal");
fynal_1.default.register("user1", "John Doe", "Jerome@99")
    .then(function (result) {
    console.log(result);
})
    .catch(function (error) {
    console.error(error);
})
    .finally(function () {
    console.log("Done");
});
