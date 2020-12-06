import React, { Component } from "react";
import CanvasJSReact from "../../../../asset/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;
CanvasJS.addColorSet("colorShades", ["#03bb95", "#ffb224"]);

class PieChartWithCustomization extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { setTaskType } = this.props;
    const {
      pieStartedTasks,
      pieInprogressTasks,
      pieCompletedTasks,
      pieOverdueTasks,
    } = this.props.taskDetails;

    let totalCount = 0;
    if (
      (pieStartedTasks && pieStartedTasks.totalTasksCount) ||
      (pieInprogressTasks && pieInprogressTasks.totalTasksCount) ||
      (pieCompletedTasks && pieCompletedTasks.totalTasksCount) ||
      (pieOverdueTasks && pieOverdueTasks.totalTasksCount)
    ) {
      totalCount =
        Number(pieStartedTasks.totalTasksCount || 0) +
        Number(pieInprogressTasks.totalTasksCount || 0) +
        Number(pieCompletedTasks.totalTasksCount || 0) +
        Number(pieOverdueTasks.totalTasksCount || 0);
    }
    // let totalCount = Number(pieStartedTasks.totalTasksCount || 0) + Number(pieInprogressTasks.totalTasksCount || 0) + Number(pieCompletedTasks.totalTasksCount || 0) + Number(pieOverdueTasks.totalTasksCount || 0);
    let organiserCount = 0;
    if (
      (pieStartedTasks && pieStartedTasks.organizerTasksCount) ||
      (pieInprogressTasks && pieInprogressTasks.organizerTasksCount) ||
      (pieCompletedTasks && pieCompletedTasks.organizerTasksCount) ||
      (pieOverdueTasks && pieOverdueTasks.organizerTasksCount)
    ) {
      organiserCount =
        Number(pieStartedTasks.organizerTasksCount || 0) +
        Number(pieInprogressTasks.organizerTasksCount || 0) +
        Number(pieCompletedTasks.organizerTasksCount || 0) +
        Number(pieOverdueTasks.organizerTasksCount);
    }
    let myTaskCount = 0;
    if (
      (pieStartedTasks && pieStartedTasks.mytasksCount) ||
      (pieInprogressTasks && pieInprogressTasks.mytasksCount) ||
      (pieCompletedTasks && pieCompletedTasks.mytasksCount) ||
      (pieOverdueTasks && pieOverdueTasks.mytasksCount)
    ) {
      myTaskCount =
        Number(pieStartedTasks.mytasksCount || 0) +
        Number(pieInprogressTasks.mytasksCount || 0) +
        Number(pieCompletedTasks.mytasksCount || 0) +
        Number(pieOverdueTasks.mytasksCount || 0);
    }

    let organiser = 0;
    if (organiserCount && totalCount) {
      organiser = (organiserCount / totalCount) * 100;
      if (organiser) {
        organiser = organiser.toFixed(2);
      }
    }
    let myTask = 0;
    if (myTaskCount && totalCount) {
      myTask = (myTaskCount / totalCount) * 100;
      if (myTask) {
        myTask = myTask.toFixed(2);
      }
    }

    const options = {
      animationEnabled: true,
      colorSet: "colorShades",
      toolTip: {
        shared: false,
        borderColor: "#fff",
        contentFormatter: function (e) {
          var content = " ";
          for (var i = 0; i < e.entries.length; i++) {
            // content += "<ul style='margin:0; padding: 0;'><li style='margin: 0;padding: 10px; width: 150px; background-color: red;'>" + e.entries[i].dataPoint.label + " " + "</li></ul>";
            content +=
              `<div style='background-color: #e3f1fc; text-align: center; padding: 10px;'>` +
              e.entries[i].dataPoint.label +
              `</div>
            <ul style='padding:0;width:180px;height: 150px' >
              <li style='display:flex; align-items:center; justify-content:space-between;padding: 10px;background-color: #f5fafe; position: relative'>
              <div><span style='width: 10px; height: 10px; background-color: #4aabe0;position: absolute; top: 50%;transform: translateY(-50%);'></span><span style="padding-left: 20px;">In Progress</span></div><div>${e.entries[i].dataPoint.tasks.inProgressCount}</div></li>
              <li style='display: flex; justify-content: space-between;padding: 10px;background-color: #fdfeff;  position: relative''>
              <div><span style='width: 10px; height: 10px; background-color: #ffc70b;position: absolute; top: 50%;transform: translateY(-50%);'></span><span style="padding-left: 20px;">Not Started</span></div><div>${e.entries[i].dataPoint.tasks.notStartedCount}</div></li>
              <li style='display: flex; justify-content: space-between;padding: 10px;background-color: #f5fafe;  position: relative''><div>
              <span style='width: 10px; height: 10px; background-color: #85c13b;position: absolute; top: 50%;transform: translateY(-50%);'></span><span style="padding-left: 20px;">Completed</span></div><div>${e.entries[i].dataPoint.tasks.completedCount}</div></li>
              <li style='display: flex; justify-content: space-between;padding: 10px;background-color: #fdfeff;  position: relative''><div>
              <span style='width: 10px; height: 10px; background-color: #d64032;position: absolute; top: 50%;transform: translateY(-50%);'></span><span style="padding-left: 20px;">Over Due</span></div><div>${e.entries[i].dataPoint.tasks.overDueCount}</div></li>
            </ul>`;
            // content += "<br/>";
          }
          return content;
        },
      },
      data: [
        {
          type: "doughnut",
          indexLabel: "{label} {y}%",
          startAngle: 60,
          innerRadius: 90,
          indexLabelFontSize: 17,
          indexLabelMaxWidth: 120,
          explodeOnClick: true,
          indexLabelFontColor: "black",
          indexLabelFontWeight: "bold",
          dataPoints: [
            {
              y: organiser,
              label: "Actions (Organiser)",
              tasks: {
                notStartedCount:
                  pieStartedTasks && pieStartedTasks.organizerTasksCount
                    ? pieStartedTasks.organizerTasksCount
                    : 0,
                inProgressCount:
                  pieInprogressTasks && pieInprogressTasks.organizerTasksCount
                    ? pieInprogressTasks.organizerTasksCount
                    : 0,
                completedCount:
                  pieCompletedTasks && pieCompletedTasks.organizerTasksCount
                    ? pieCompletedTasks.organizerTasksCount
                    : 0,
                overDueCount:
                  pieOverdueTasks && pieOverdueTasks.organizerTasksCount
                    ? pieOverdueTasks.organizerTasksCount
                    : 0,
              },
              click: function (e) {
                setTaskType("Organiser Actions");
              },
            },
            {
              y: myTask,
              label: "My Actions (Attendee)",
              tasks: {
                notStartedCount:
                  pieStartedTasks && pieStartedTasks.mytasksCount
                    ? pieStartedTasks.mytasksCount
                    : 0,
                inProgressCount:
                  pieInprogressTasks && pieInprogressTasks.mytasksCount
                    ? pieInprogressTasks.mytasksCount
                    : 0,
                completedCount:
                  pieCompletedTasks && pieCompletedTasks.mytasksCount
                    ? pieCompletedTasks.mytasksCount
                    : 0,
                overDueCount:
                  pieOverdueTasks && pieOverdueTasks.mytasksCount
                    ? pieOverdueTasks.mytasksCount
                    : 0,
              },
              click: function (e) {
                setTaskType("My Actions");
              },
            },
          ],
        },
      ],
    };

    return (
      <div className="chartContainer">
        <CanvasJSChart className="pieChartStyle" options={options} />
        <div
          className="circle"
          onClick={() => {
            // const obj = {
            //   email: userDetails.email,
            //   label: 'Total Tasks'
            // }
            // getParticularTasks(obj).then(result => {
            //   const { status } = result.payload.data;
            //   if (status === 200) {
            //     setTaskType('All Tasks')
            //   }
            // })
            setTaskType("All Actions");
          }}
        >
          {organiser || myTask
            ? `All Actions (${totalCount || 0})`
            : "No Actions"}
        </div>
      </div>
    );
  }
}

export default PieChartWithCustomization;
