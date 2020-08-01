window.addEventListener("load", () => {
  console.log(survey);
  if (!document.getElementById("chartContainer")) return;
  // Set chart dataOptions
  const dataPoints = [];
  survey.answers.forEach((answer) => {
    dataPoints.push({
      y: answer.votes,
      indexLabel: answer.name,
    });
  });
  // Create new chart
  const chart = new CanvasJS.Chart("chartContainer", {
    data: [
      {
        type: "pie",
        showInLegend: true,
        legendText: "{indexLabel}",
        toolTipContent: "{y} - #percent %",
        dataPoints: dataPoints,
      },
    ],
  });

  chart.render();
});
