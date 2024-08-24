# Flow of authentication for registering

1. a: send jwt token uniquely identifying what company they are registering with (get request) 
   * create token with token string and id (no need for expiration date) (this token will be)
1. rate limit max 15
2. validate req.body with dto from class-validator library
3. sanitize body with sanitizer 
4. validate user with username does not exist in relation with company_id it is associated with in the registration process
5. validate user with email does not exist in relation with company_id it is associated with in the registration process
6. check if 
(note for this point, a user with the same user name can exist in the db so long as its association with company's differ
)
(additional note: because technically the company id could be changed in the payload, there needs to be a one time token generated on registration that has an encoded signature in association with the company. )
so: 
* user clicks register through whatever company is integrating the auth service
* the register button hits endpoint that sends token to uniquely identifier what company the user is authenticating through
* on registration the unique token is scanned, 
  * a search is done in a register token table for that token, if it exists, then continue, if not throw error. 
  * after sucessfully finding it, then validate the token and make sure not expired,
  * then decode the token and find the id that is associated with it 
  * after that hash password, prepare user input with decoded token value, then created user and then delete all records of the token in the database