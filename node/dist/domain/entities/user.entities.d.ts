declare class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly role: string[];
    readonly img?: string | undefined;
    constructor(id: string, name: string, email: string, password: string, role: string[], img?: string | undefined);
}
export = User;
//# sourceMappingURL=user.entities.d.ts.map