/*
A JavaScript Tool to Retrieve Draft Assignment Grades in CSV form from D2L 
(Tested in Google Chrome in March 2022)

Usage: 
1. Open your Course in D2L
2. Go to Assessments > Assignments
3. Click on an Assignment to view submissions
4. Click on the first Submission to open the iterator
    (You should see User 1 of 25 in the top right.)
5. Open the browser console: press Ctrl+Shift+J (or Cmd+Shift+J on a Mac)
6. Copy and Paste in the Code below
7. JavaScript iterates over each student and downoads a CSV when finished.
*/


let grades = []
let theProcess 

function getStudentName(){
    return document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-learner-context-bar')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-lcb-user-context')
        .shadowRoot
        .querySelector('h2')		
        .getAttribute('title') 
}


function getStudentID(){
    return document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-learner-context-bar')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-lcb-user-context')
        .shadowRoot
        .querySelector('d2l-labs-user-profile-card')
        .shadowRoot
        .querySelector('d2l-dropdown d2l-dropdown-content li').textContent
}


/* get the score assuming the score is out of 100 */
function getGrade(){ 
    return document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('consistent-evaluation-right-panel')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-right-panel-grade-result')
        .shadowRoot
        .querySelector('d2l-labs-d2l-grade-result-presentational')
        .getAttribute('scorenumerator')
}


function getAssignmentName(){
    return document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-nav-bar')
        .shadowRoot
        .querySelector('div[slot="middle"]') 
        .querySelector('h1')
        .textContent
        .replaceAll(":", "-"); 
}

function getCourseName(){
    return document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-nav-bar')
        .shadowRoot
        .querySelector('div[slot="middle"]') 
        .querySelector('div')
        .textContent
        .replaceAll(":", "-");
        
}

function nextStudent(){
    let nextButton = document.querySelector('d2l-consistent-evaluation')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-page')
        .shadowRoot
        .querySelector('d2l-consistent-evaluation-nav-bar')
        .shadowRoot
        .querySelector('d2l-navigation-iterator')
        .shadowRoot
        .querySelector('d2l-navigation-iterator-item[type="next"]')
        .shadowRoot
        .querySelector('d2l-navigation-button')
        .shadowRoot
        .querySelector('button')

    if (nextButton.hasAttribute("disabled")){ 
        clearInterval(theProcess);
        console.log('Finished');
        generateCSV(grades);
    } 
    else{
        nextButton.click()
    }
}

function processStudent(){
	let currentStudent = getStudentName()
    let currentID = getStudentID()
	let currentGrade = getGrade()
	if (currentStudent != '' && currentID != '' && currentGrade != ''){
		if ( grades.filter(grade => grade.studentName == currentStudent).length == 0 ) {
            console.log(currentID  + ', ' + currentStudent + ',  '+ currentGrade)
			grades.push({
                studentID: currentID,
				studentName: currentStudent,
				grade: currentGrade
			}); 
            nextStudent();
		}
	}
}

function generateCSV(grades){ 
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=  "Student ID,Student Name,Grade\r\n";
    for(grade of grades){ 
        csvContent += 
            grade.studentID + ","+
            grade.studentName + ","+ 
            grade.grade+"\r\n";
    }
    let downloadLink = document.createElement("a");
    downloadLink.href = encodeURI(csvContent);
    downloadLink.download = "Draft Grades for " + getAssignmentName() + ' in ' + getCourseName() + ".csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);    
}

theProcess = setInterval(processStudent, 100);




