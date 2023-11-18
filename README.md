# P6-Python-Web-Application
This web application was developed as a learning project for OpenClassrooms, utilizing HTML, CSS, and JavaScript. 
To operate the application, it needs to be executed alongside the OCMovies-API, which is a REST API provided by OpenClassrooms. 
This API is used to fetch data and script will handle the responses in JSON format and present it on the web page specifically designed for this project. 
To run the application, kindly follow the steps outlined below:

OCMovies-API: Test API providing movie information.
The OCMovies-API project is a REST API application to be executed locally in the context of educational projects. It provides movie information from GET http endpoints. 
The API provides these endpoints to get detailed infomation about movies filtered by various criteria such as genre, IMDB score or year. 
Endpoints allow users to retrieve information for individual movies or lists of movies.

Installation

1) Clone this repository using $ git clone clone https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR.git (you can also download the code using as a zip file)
2) Move to the ocmovies-api root folder with $ cd ocmovies-api-en
3) Create a virtual environment for the project with $ py -m venv env on windows or $ python3 -m venv env on macos or linux.
4) Activate the virtual environment with $ env\Scripts\activate on windows or $ source env/bin/activate on macos or linux.
5) Install project dependencies with $ pip install -r requirements.txt
6) Create and populate the project database with $ python manage.py create_db
7) Run the server with $ python manage.py runserver
When the server is running after step 7 of the procedure, the OCMovies API can be requested from endpoints starting with the following base URL: http://localhost:8000/api/v1/titles/.

Steps 1-3 and 5-6 are only required for initial installation. For subsequent launches of the API, you only have to execute steps 4 and 7 from the root folder of the project.

As last step, you should open the index.html file on your chosen browser.


