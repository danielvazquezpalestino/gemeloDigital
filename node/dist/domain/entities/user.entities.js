"use strict";
class User {
    id;
    name;
    email;
    password;
    role;
    img;
    constructor(id, name, email, password, role, img) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.img = img;
    }
}
module.exports = User;
//# sourceMappingURL=user.entities.js.map