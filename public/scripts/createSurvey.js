document.getElementById("addAnswer").addEventListener("click", () => {
  // Selectors
  const answersListElement = document.getElementById("answers-list");
  const answersListItems = answersListElement.querySelectorAll("li");
  const answerNextNumber = answersListItems.length + 1;

  // Create answer element
  const li = document.createElement("li");

  const label = document.createElement("label");
  label.setAttribute("for", `answer${answerNextNumber}`);
  label.innerText = `Answer #${answerNextNumber}`;

  const input = document.createElement("input");
  input.type = "text";
  input.id = `answer${answerNextNumber}`;
  input.name = "answer";
  input.placeholder = "Answer name...";

  // Apend elements
  li.appendChild(label);
  li.appendChild(input);
  answersListElement.appendChild(li);
});
