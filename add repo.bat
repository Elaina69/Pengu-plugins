@echo off
set /p repo_link="Enter GitHub repository link: "

git submodule add %repo_link%
git submodule update --init --recursive

echo Submodule added successfully.