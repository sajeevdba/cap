setup:

prerequisite -> Python 3.10

1.  Open cmd from the project root directory

2.  Env setup

        a) Execute the below command to activate the virtual env
            venv_py3.10\Scripts\activate.bat

        b) Use the below command to install the requirements in the python enviornment.
            pip install -r requirements.txt

3.  To insert the dummy data(if required).

        1) Copy the contents of app\services\db_insert.py

        2)  Open python terminal by below command.
                python
        3)  Pase and run the contents on the terminal

4.  Run the FastAPI app.
    python run.py

5.  Access the swagger ui by the bellow URL.
    http://localhost:8080/docs
