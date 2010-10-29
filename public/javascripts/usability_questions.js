var question_key = {
  terminology: 'Is our terminology correct?',
  right_problem: 'What problems should the product solve?',
  user_types: 'What are the major types of users?',
  task_steps: 'What are the steps of the task?',
  right_approach: 'Will users understand our approach?',
  varying_perspectives: 'What varying perspectives affect product usage?',
  varying_goals: 'What varying goals affect product usage?',
  workflow: 'What is the workflow users follow to perform their tasks?',
  understand_attitudes: 'What are the users\' attitudes, beliefs, desires, and experiences?',
  right_ia: 'What should the categories/IA/structure be?',
  understand_domain: 'Do we understand the domain?',
  understand_goals: "What are the user's goals?",
  understand_product_problems: 'What are the usability problems?',  //What areas have the worst usability problems?
  define_cost: 'How much should it cost?',
//    questions: 'xxx',
//    questions: 'xxx',
//    questions: 'xxx',
//    questions: 'xxx',
//    questions: 'xxx',
  satisfied: 'How satisfied are users with your site?'
};


var activities =
        [
          {
            name: 'eye tracking',
            category: ['design','test'],
            egs: ['Do people do/see what we expect?'],
            effort: 2
          },
          {
            name: 'prototyping (paper, higher-fidelity)',
            category: ['design','test'],
            egs: [
              'task_steps',
              "terminology",
              'right_approach',
              'right_problem'
            ],
            ref: 'http://www.usability.gov/methods/design_site/prototyping.html',
            effort: 2
          },
          {
            name: 'developing personas',
            category: ['requirements'],
            tests: 'definition of user',
            egs: [
              'understand_attitudes',
              'user_types',
              'varying_perspectives',
              'varying_goals',
              ''],
            ref: 'http://www.usability.gov/methods/analyze_current/personas.html',
            effort: 3
          },
          {
            name: 'contextual interview',
            tests: 'problems, domain knowledge, goals, tasks',
            egs: [
              'varying_perspectives',
              'varying_goals',
              "terminology",
              "right_problem",
              "What is a reasonable time frame?",
              'Who does/helps with the tasks?'
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/learn/contextual.html',
            effort: 2
          },
          {name: 'subject matter expert interviews',
            tests: 'complexities of domain, specialized knowledge, best practices',
            egs: [
              "terminology",
              "right_problem" //              "What is a reasonable time frame?"
            ],
            effort: 2},
          {name: 'customer interviews',
            tests: 'goals, frustrations, buying considerations',
            egs: [
              'varying_perspectives',
              'varying_goals',
              "define_cost",
              "right_problem",
              "What is a reasonable time frame?"
            ],
            effort: 2
          },
          {name: 'quantitative research',
            tests: 'financial questions, market demographics',
            egs: [
              'define_cost',
              'Are there potential users?'
            ],
            effort: 2
          },
          {
            name: 'web analytics',
            egs: [
              'What links and pages aren\'t used?',
              'What do users actually do/find on our site?',
              'Can different variants increase click-through (A v. B)?'
            ],
            effort: 1
          },
          {name: 'focus groups',
            tests: 'sense of brand or new domain',
            category: ['requirements','design'],
            egs: [
              'varying_perspectives',
              'varying_goals',
              'Do users understand the brand?',
              'understand_domain',
              'understand_attitudes',
              'What are users\' reactions to ideas?',
              'What are users\' reactions to prototypes?'
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/learn/focus.html',
            effort: 3
          },
          {
            name: 'card sorting',
            category: ['requirements','design','test'],
            egs:[
              'right_ia',
              "terminology"
            ],
            ref: 'http://www.usability.gov/methods/design_site/cardsort.html',
            effort: 2
          },
          {
            name: 'task analysis',
            category: ['requirements'],
            egs: [
              'understand_goals',
              'How does a user achieve goals?',
              'What personal, social and cultural characteristics do users bring to the tasks?',
              'How are users influenced by their physical environment?',
              'How do users think about their work?',
              'workflow'
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/analysis.html',
            effort: 2
          },
          {name: 'usability testing',
            category: ['requirements','design','test'],
            tests: "assessing prototype's first-time ease of use, fine tuning button labels and such, persuading people there IS a problem",
            egs: [
              'understand_product_problems',
              'How easy is it to learn?',
              'Is the usability that bad?',
              "terminology",
              'Can users accomplish X in time Y?',
              'What is the error rate?',
              'Do users understand how to use it?',
              'Can users can make the right choice and explain the why?'
            ],
            ref: 'http://www.usability.gov/methods/test_refine/learnusa/index.html',
            effort: 2
          },
          {
            name: 'remote automated user testing',
            egs: [
              'understand_product_problems',
              "Can users achieve a goal within a scenario?",
              'Is the usability that bad?',
              "terminology",
              'Do users understand how to use it?',
              'Can users accomplish X in time Y?',
              "Can users complete a task?"
            ],
            effort: 1
          },
          {
            name: 'heuristic evaluations',
            category: ['requirements','test'],
            eg: [
              'understand_product_problems',
              'What areas need the most attention?'
            ],
            ref: 'http://www.usability.gov/methods/test_refine/heuristic.html',
            effort: 2
          },
          {
            name: 'individual interviews',
            category: ['requirements','design','test'],
            eg: [
              'understand_attitudes',
              'right_ia',
              "terminology"
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/learn/individual.html',
            effort: 2
          },
          {name: 'online surveys',
            category: ['requirements','design','test'],
            egs: [
              'What are the demographics of the users?',
              'What are the users\' opinions of your site?',
              'What information are users looking for?',
              'satisfied',
              'What frustrations have users had with your site?',
              'Do users have any ideas or suggestions for improvements?'
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/learn/surveys.html',
            effort: 2
          },
          {
            name: 'support forums (yours and competitors)',
            category: ['requirements','design','test'],
            egs: [
              'What are the users\' opinions of your site?',
              'What information are users looking for?',
              'satisfied',
              'What frustrations have users had with your site?',
              'Do users have any suggestions for improvements?'
            ],
            ref: 'http://www.usability.gov/methods/analyze_current/learn/surveys.html',
            effort: 1
          }
//            {name: 'user diaries',
//              tests: 'behavior over time',
//              egs: [
////                'How do people behave over time?'
//              ],
//              effort: 3},
//            {name: 'ethnographic interviews',
//              tests: 'extract values and goals that motivate actions',
//              egs: [
//              ],
//              effort: 3
//            }
];

for (var i = 0; i < activities.length; i++) {
  var activity = activities[i];
  if (activity.egs) {
    for (var e = 0; e < activity.egs.length; e++) {
      var q = activity.egs[e];
      activity.egs[e] = question_key[q] || q;
    }
  }
}

