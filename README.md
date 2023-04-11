# Valencia Online Shopping
This is the main repository for the backend.
It sets up the backend api for the application utilizing spring boot.

Here is what you will find in each folder:
- `Backend`: Java Spring Boot API for querying data and providing response to Frontend
- `Frontend`: HTML, JavaScript, & CSS for main website
- `Proxy`: Configuration files for nginx reverse proxy

You need to set the following three environment variables for the backend to work:
- `DB_URL`: The url to your MySQL server with db name included (i.e. `jdbc:mysql://localhost:3306/eshop?useSSL=false&allowPublicKeyRetrieval=true`)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password