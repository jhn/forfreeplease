require 'bundler/capistrano'
require 'rvm/capistrano'

set :rvm_ruby_string, :local
set :application, "For Free, Please"
set :repository,  "git@github.com:jhn/forfreeplease.git"
set :deploy_to, "/home/jhn/rails"
set :scm, :git
set :branch, "master"
set :user, "jhn"
set :use_sudo, false
set :rails_env, "production"
set :deploy_via, :copy
set :ssh_options, { :forward_agent => true, :port => 20532}
set :keep_releases, 3

default_run_options[:pty] = true

server "162.243.23.71", :app, :web, :db, :primary => true

namespace :deploy do
  desc "Restart capistrano"
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end

namespace :figaro do
  desc "Copy figaro config"
  task :copy do
    upload "config/application.yml", "#{shared_path}/application.yml", :via => :scp
  end

  desc "Link the figaro config in the release_path"
  task :symlink do
    run "test -f #{release_path}/config/application.yml || ln -s #{shared_path}/application.yml #{release_path}/config/application.yml"
  end
end

after "deploy", "figaro:copy"
after "deploy", "figaro:symlink"
