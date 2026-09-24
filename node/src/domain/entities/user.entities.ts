


class User
{
    constructor 
    (
        public readonly id: string ,
         public readonly name: string , 
         public readonly email: string,
         public readonly password: string,
         public readonly role: string[],
         public readonly img?: string,
        ) 
        {

        }
}

export = User;