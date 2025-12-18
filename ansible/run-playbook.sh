#!/bin/bash
# Ansible Playbook Execution Script for Library Management System

echo "🚀 Starting Ansible Configuration for Library Management System"
echo "=================================================="

# Check if Ansible is installed
if ! command -v ansible-playbook &> /dev/null; then
    echo "❌ Ansible is not installed. Installing..."
    
    # Install Ansible based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y ansible
        # CentOS/RHEL
        elif command -v yum &> /dev/null; then
            sudo yum install -y epel-release
            sudo yum install -y ansible
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ansible
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    fi
fi

# Verify Ansible installation
echo "📋 Ansible Version:"
ansible --version

echo ""
echo "📁 Current Directory: $(pwd)"
echo "📄 Inventory File: hosts.ini"
echo "📖 Playbook File: playbook.yml"

echo ""
echo "🔍 Checking inventory..."
ansible-inventory --list -i hosts.ini

echo ""
echo "🧪 Testing connectivity to all hosts..."
ansible all -i hosts.ini -m ping

echo ""
echo "🎯 Running Ansible Playbook..."
echo "=================================================="

# Run the playbook with verbose output
ansible-playbook -i hosts.ini playbook.yml -v

# Check exit status
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Ansible Playbook Execution Completed Successfully!"
    echo "=================================================="
    echo ""
    echo "📊 Summary:"
    echo "- Web servers configured with Nginx"
    echo "- Application servers configured with Node.js and PM2"
    echo "- Database servers configured with PostgreSQL"
    echo "- Load balancers configured with HAProxy"
    echo "- Monitoring tools installed and configured"
    echo ""
    echo "📁 Check log files in /var/log/library-management-system/"
    echo "🔍 Run health check: /usr/local/bin/lms-health-check.sh"
    echo ""
    echo "🎉 Library Management System infrastructure is ready!"
else
    echo ""
    echo "❌ Ansible Playbook Execution Failed!"
    echo "Check the error messages above and ansible.log for details."
    exit 1
fi