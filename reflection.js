window.stillroomReflection = {
  "name": "",
  "opinion": "I’d choose Burp Suite. Both Burp and ZAP worked well for intercepting traffic, but Burp felt more complete for the way I like to investigate a finding. The moment that shaped my opinion was reviewing the shop’s search page. ZAP flagged the search term as a possible reflected XSS issue and marked the alert as low confidence. In Burp’s HTTP history, I could see the request beside the raw response and check both places where the search term appeared. In each place, the shop had encoded the angle brackets. What I liked about Burp was how easily I could trace a specific input through to the response and explain why I wouldn’t report it as XSS.",
  "contribution": ""
};
