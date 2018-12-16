import {
  SubjectGrade,
  SubjectReportCard,
  AssignmentGrade
} from './gradetypes';

const classList: object = {
  "socialstudies": ["hist", "gov", "macro eco", "street law", "human geog", "geog", "wd area", "economics"],
  "art": ["treble", "clarinet", " orch", "art", "band", "animation", "theater", "bnd ", "orchest", "aud vid", "chrl ", "music", "choir", "a/v", "av pro", "voc ens", "symph", "th. pro", " strings"],
  "english": ["journl ", "journal", "eng ", "creative write", "english", "debate"],
  "science": ["med term", "envir", "forensics", "chemsitry", "phys ", "chemistry", "phy/chem", "web tech", "tch sys", "livestock", "electr", "vet med", "wldlif fish eco", "prof comm", "sci", "robot", "physics", "antmy", "physlgy", "biology", "sociology", "animal", "psychology", "chem ", "bio ", "medical", "prin ag fd nt r", "food tech", "com prog"],
  "math": ["geom", "cal-", "bank financ", "calc", "geometry", "pre cal", "algebra", "statistics", "alg ", "accounting"],
  "language": ["span iv", "spanish", "french", "latin", "german"],
  "sports": ["ath ", "athletics", "phys ed", "athlet", "cheerleading", "dance", "sports"]
};

const timeFormats = [
  [60, 'seconds', 1],                           // 60
  [120, '1 minute ago', '1 minute from now'],   // 60*2
  [3600, 'minutes', 60],                        // 60*60, 60
  [7200, '1 hour ago', '1 hour from now'],      // 60*60*2
  [86400, 'hours', 3600],                       // 60*60*24, 60*60
  [172800, 'Yesterday', 'Tomorrow'],            // 60*60*24*2
  [604800, 'days', 86400],                      // 60*60*24*7, 60*60*24
  [1209600, 'Last week', 'Next week'],          // 60*60*24*7*4*2
  [2419200, 'weeks', 604800],                   // 60*60*24*7*4, 60*60*24*7
  [4838400, 'Last month', 'Next month'],        // 60*60*24*7*4*2
  [29030400, 'months', 2419200],                // 60*60*24*7*4*12, 60*60*24*7*4
  [58060800, 'Last year', 'Next year'],         // 60*60*24*7*4*12*2
  [2903040000, 'years', 29030400],              // 60*60*24*7*4*12*100, 60*60*24*7*4*12
  [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
  [58060800000, 'centuries', 2903040000]        // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
];

function getClassType(name: string): string {
  name = name.toLowerCase();
  for (let classType of Object.keys(classList)) {
    let kwords = classList[classType];
    for (let word of kwords) {
      if (name.includes(word)) {
        return classType;
      }
    }
  }
  return "other";
}

export function getIcon(subject: SubjectGrade) {
  let classType = getClassType(subject.name);
  if (classType == "socialstudies") {
    return "people";
  } else if (classType == "art") {
    return "brush";
  } else if (classType == "english") {
    return "bookmarks";
  } else if (classType == "science") {
    return "flask";
  } else if (classType == "math") {
    return "calculator";
  } else if (classType == "language") {
    return "globe";
  } else if (classType == "sports") {
    return "american-football";
  } else {
      return "create";
  }
}

export function getColor(letter: string): string {
  if (letter == 'A') {
    return 'great';
  } else if (letter == 'B') {
    return 'ok';
  } else if (letter == 'C') {
    return 'poor';
  } else if (letter == 'Z') {
    return 'zero';
  } else if (letter == 'U' || letter === '') {
    return 'none';
  } else {
    return 'bad';
  }
}

export function getColorRank(percentile: number): string {
  if (percentile <= 10) {
    return 'great';
  } else if (percentile <= 40) {
    return 'ok';
  } else if (percentile <= 60) {
    return 'poor';
  } else {
    return 'bad';
  }
}

export function timeAgo(date: Date): string {

  let time = (Date.now() - date.getTime());

  let seconds = time / 1000,
      token = 'ago',
      list_choice = 1;

  if (seconds == 0) {
    return 'Just now'
  } else if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }

  var i = 0,
      format;

  while (format = timeFormats[i++]) {
    if (seconds < format[0]) {
      if (typeof format[2] == 'string')
        return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  }

  return "";

}
