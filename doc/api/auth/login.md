# /login
**Full URL:** /api/auth/login  
**HTTP Method:** POST  
## Request:
```ts
Content-Type: application/json; charset=utf-8

{
    email: "username@mail.com"
    password: "123456"
}
```
## Response:
```ts
{
    error: false,
    data: {
        token: "f374193e5ccfeba70155ea0525d7c8f8"
    }
}
```