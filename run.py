import uvicorn
import pytest


if __name__ == "__main__":

    # run tests
    if pytest.main() == pytest.ExitCode(0):
        print("Test Passed, Running Application")

        uvicorn.run("app:app", port=8080, host="localhost", reload=True)

    else:
        print("Test case failed. Please fix the issues before running the application")
