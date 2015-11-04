require 'html/proofer'
require 'jekyll'
require 'scss_lint/rake_task'

task :build do
  Jekyll::Commands::Build.process({})
end

task :doctor do
  Jekyll::Commands::Doctor.process({})
end

task proof: :build do
  HTML::Proofer.new(
    '_site',
    check_external_hash: true,
    check_favicon: true,
    check_html: true,
    url_ignore: [%r{^/apps/}]
  ).run
end

SCSSLint::RakeTask.new :lint

task default: [:build, :doctor, :proof, :lint]
