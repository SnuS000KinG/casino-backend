npm install
npm run dev


{{baseurl}} == http://localhost:5000/api

log in    POST
{{baseurl}}/auth/login

{
    "email": "olegator6@gmail.com",
    "password": "olegator6"
}

sign in   POST
{{baseurl}}/auth/register

{
	"nickname": "olegator6",
    "email": "olegator6@gmail.com",
    "password": "olegator6"
}

get my profile    GET
{{baseurl}}/user/me



update my profile   PUT
{{baseurl}}/user/me

{
    "nickname": "Antek33",
    "currentPassword": "chujek12cm",
    "newPassword": "chlen10cm"
}

top up balance    POST
{{baseurl}}/user/topUp

{
   "amount":1000
}

Dice (5 Dice)    POST
{{baseurl}}/dice

{
    "bet": 100,
    "guessEven": true,
    "guessSum": "<= 17",
    "guessCombo": 3
    
}

Dice (more less)
{{baseurl}}/moreless

{
    "bet": 100,
    "diceBid": "7"
}

