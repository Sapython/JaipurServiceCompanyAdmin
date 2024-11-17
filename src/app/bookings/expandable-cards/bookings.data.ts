import Utils from "src/app/Shared/shared-services/util";

export const expandableTabs = [
  {
    title: 'Available Agents',
    info1: 15,
    info2: 12,
    info3: 11,
    color1: '#14ae5c',
    color2: '#bcbcbc',
    color3: '#e82c2c',
    isClicked: false,
    filteredBookings: [],
    allBookings: [],
    filterKeys : [],
    isFilterSliderActive: false
  },
  {
    title: 'Pending',
    info1: 15,
    info2: 12,
    info3: 11,
    color1: '#06a3b8',
    color2: '#007eda',
    color3: '#00518b',
    isClicked: false,
    filteredBookings: [],
    allBookings: [],
    filterKeys : [
      Utils.stageMaster.allotmentPending.key,
      Utils.stageMaster.otpVerificationPending.key,
      Utils.stageMaster.acceptancePending.key],
    isFilterSliderActive: true
  },
  {
    title: 'In-Progress',
    info1: 15,
    info2: 0,
    info3: 0,
    color1: '#d7c206',
    color2: '',
    color3: '',
    isClicked: false,
    filteredBookings: [],
    allBookings: [],
    filterKeys : [
      Utils.stageMaster.inProgress.key,
      Utils.stageMaster.paymentPending.key,
      Utils.stageMaster.paymentCompleted.key,
      Utils.stageMaster.jobAccepted.key,
      Utils.stageMaster.jobStarted.key
    ],
    isFilterSliderActive: true
  },
  {
    title: 'Completed',
    info1: 15,
    info2: 0,
    info3: 0,
    color1: '#07bf72',
    color2: '',
    color3: '',
    isClicked: false,
    filteredBookings: [],
    allBookings: [],
    filterKeys : [Utils.stageMaster.completed.key],
    isFilterSliderActive: true
  },
  {
    title: 'Cancelled',
    info1: 15,
    info2: 11,
    info3: 0,
    color1: '#c92323',
    color2: '#a8a8a8',
    color3: '',
    isClicked: false,
    filteredBookings: [],
    allBookings: [],
    filterKeys : [
      Utils.stageMaster.discarded.key,
      Utils.stageMaster.expired.key
    ],
    isFilterSliderActive: true
  },
];

export const agents = [];

export const agentColor: any = {
  'P': '#14ae5c',
  'NA': '#bcbcbc',
  'A': '#e82c2c'
}