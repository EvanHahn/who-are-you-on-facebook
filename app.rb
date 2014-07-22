require "sinatra"
require "json"
require "uri"
require "cgi"

def make_policy_for(user)
  allowed = %Q(https://www.facebook.com/me https://www.facebook.com/#{user})
  "img-src #{allowed}; report-uri /report"
end

results = {}

get "/" do
  erb :index
end

get "/test" do
  id = params[:id]
  user = params[:user]

  results[id] = {} if results[id].nil?
  results[id][user] = true

  policy = make_policy_for user
  headers \
    "Content-Security-Policy" => policy,
    "X-Content-Security-Policy" => policy,
    "X-WebKit-CSP" => policy

  body erb(:test)
end

post "/report" do
  report = JSON.parse(request.body.read)["csp-report"]
  original_uri = URI(report["document-uri"])
  query = CGI::parse(original_uri.query)
  id = query["id"].first
  user = query["user"].first

  results[id][user] = false

  status 200
end

get "/results" do
  id = params[:id]
  result = results[id]
  results.delete id

  if result.nil?
    status 404
    content_type :json
    '{ "error": "Resource not found." }'
  else
    content_type :json
    result.to_json
  end
end
