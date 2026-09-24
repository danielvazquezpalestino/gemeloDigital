
 class Validators {

  static get email() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  }

}
export = Validators;