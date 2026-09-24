declare class registerUserDTO {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    private constructor();
    static create(object: {
        [key: string]: any;
    } | undefined): [string | undefined, registerUserDTO | undefined];
}
export = registerUserDTO;
//# sourceMappingURL=register-user.dtos.d.ts.map