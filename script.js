/**
 * G-Lock Discord Ticket Bot Dashboard
 * Main JavaScript File
 */

// ==================== Mock Data (Replace with API calls) ====================
const mockStats = {
    openTickets: 12,
    resolvedToday: 8,
    averageResponseTime: '2.5 hrs',
    staffOnline: 3
};

const mockTickets = [
    {
        id: 1,
        number: 1001,
        title: 'Cannot login to my account',
        category: 'ACCOUNT_ISSUES',
        status: 'OPEN',
        priority: 'HIGH',
        createdBy: 'JohnDoe#1234',
        createdById: '123456789012345678',
        createdAt: '2023-05-01T12:00:00Z',
        updatedAt: '2023-05-01T14:30:00Z',
        assignedTo: 'Support Agent 1',
        assignedToId: '1'
    },
    {
        id: 2,
        number: 1002,
        title: 'Feature suggestion: Dark mode',
        category: 'FEATURE_REQUESTS',
        status: 'NEW',
        priority: 'MEDIUM',
        createdBy: 'JaneSmith#5678',
        createdById: '234567890123456789',
        createdAt: '2023-05-01T13:15:00Z',
        updatedAt: '2023-05-01T13:15:00Z',
        assignedTo: null,
        assignedToId: null
    },
    {
        id: 3,
        number: 1003,
        title: 'Payment failed for subscription',
        category: 'BILLING',
        status: 'WAITING',
        priority: 'URGENT',
        createdBy: 'BobJohnson#9012',
        createdById: '345678901234567890',
        createdAt: '2023-05-01T10:30:00Z',
        updatedAt: '2023-05-01T11:45:00Z',
        assignedTo: 'Support Agent 2',
        assignedToId: '2'
    },
    {
        id: 4,
        number: 1004,
        title: 'Application crashes on startup',
        category: 'TECHNICAL_SUPPORT',
        status: 'OPEN',
        priority: 'HIGH',
        createdBy: 'AliceWilliams#3456',
        createdById: '456789012345678901',
        createdAt: '2023-04-30T16:20:00Z',
        updatedAt: '2023-05-01T09:10:00Z',
        assignedTo: 'Support Agent 1',
        assignedToId: '1'
    },
    {
        id: 5,
        number: 1005,
        title: 'Need help with API integration',
        category: 'TECHNICAL_SUPPORT',
        status: 'RESOLVED',
        priority: 'MEDIUM',
        createdBy: 'CharlieBrown#7890',
        createdById: '567890123456789012',
        createdAt: '2023-04-29T14:00:00Z',
        updatedAt: '2023-05-01T08:30:00Z',
        assignedTo: 'Support Agent 3',
        assignedToId: '3'
    }
];

const mockTicketMessages = [
    {
        id: 1,
        ticketId: 1,
        content: 'I\'m trying to login to my account but I keep getting "Invalid credentials" error even though I\'m sure my password is correct. I\'ve tried resetting it twice already.',
        sender: 'JohnDoe#1234',
        senderId: '123456789012345678',
        isStaff: false,
        createdAt: '2023-05-01T12:00:00Z'
    },
    {
        id: 2,
        ticketId: 1,
        content: 'Hi there! I\'m sorry to hear you\'re having trouble logging in. Let me look into this for you. Could you please tell me what happens exactly after you enter your credentials? Do you receive any specific error message?',
        sender: 'Support Agent 1',
        senderId: '987654321098765432',
        isStaff: true,
        createdAt: '2023-05-01T12:15:00Z'
    },
    {
        id: 3,
        ticketId: 1,
        content: 'After I enter my email and password and click the login button, it just says "Invalid credentials" in red text. I\'ve checked my caps lock and made sure I\'m using the correct email address.',
        sender: 'JohnDoe#1234',
        senderId: '123456789012345678',
        isStaff: false,
        createdAt: '2023-05-01T12:20:00Z'
    },
    {
        id: 4,
        ticketId: 1,
        content: 'Thank you for providing that information. Let me check your account status in our system. I can see that your account is currently locked due to multiple failed login attempts. This is a security measure to protect your account. I can unlock it for you now. Would you like me to also help you reset your password?',
        sender: 'Support Agent 1',
        senderId: '987654321098765432',
        isStaff: true,
        createdAt: '2023-05-01T12:30:00Z'
    }
];

const mockCategoryData = {
    'TECHNICAL_SUPPORT': 35,
    'ACCOUNT_ISSUES': 25,
    'BILLING': 15,
    'FEATURE_REQUESTS': 20,
    'OTHER': 5
};

const mockStaffMembers = [
    { id: '1', username: 'Support Agent 1' },
    { id: '2', username: 'Support Agent 2' },
    { id: '3', username: 'Support Agent 3' }
];

// ==================== Utility Functions ====================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatTime(dateString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
}

function formatDateTime(dateString) {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
}

function getCategoryLabel(category) {
    return category
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getCategoryClass(category) {
    switch (category) {
        case 'TECHNICAL_SUPPORT': return 'tech';
        case 'ACCOUNT_ISSUES': return 'account';
        case 'BILLING': return 'billing';
        case 'FEATURE_REQUESTS': return 'feature';
        default: return 'other';
    }
}

function getStatusClass(status) {
    return status.toLowerCase();
}

// ==================== UI Rendering Functions ====================
function renderStats() {
    document.getElementById('open-tickets-count').textContent = mockStats.openTickets;
    document.getElementById('resolved-today-count').textContent = mockStats.resolvedToday;
    document.getElementById('avg-response-time').textContent = mockStats.averageResponseTime;
    document.getElementById('staff-online-count').textContent = mockStats.staffOnline;
}

function renderRecentTickets() {
    const tbody = document.getElementById('recent-tickets-tbody');
    tbody.innerHTML = '';

    // Show only first 5 tickets for recent tickets
    const recentTickets = mockTickets.slice(0, 5);

    recentTickets.forEach(ticket => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>#${ticket.number}</td>
            <td>${ticket.title}</td>
            <td>
                <span class="ticket-category ${getCategoryClass(ticket.category)}">
                    ${getCategoryLabel(ticket.category)}
                </span>
            </td>
            <td>
                <span class="ticket-status ${getStatusClass(ticket.status)}">
                    ${ticket.status}
                </span>
            </td>
            <td>${ticket.createdBy}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td class="ticket-actions">
                <button class="action-btn view-ticket" data-ticket-id="${ticket.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-ticket');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketId = button.getAttribute('data-ticket-id');
            openTicketModal(parseInt(ticketId));
        });
    });
}

function renderAllTickets() {
    const tbody = document.getElementById('all-tickets-tbody');
    tbody.innerHTML = '';

    mockTickets.forEach(ticket => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>#${ticket.number}</td>
            <td>${ticket.title}</td>
            <td>
                <span class="ticket-category ${getCategoryClass(ticket.category)}">
                    ${getCategoryLabel(ticket.category)}
                </span>
            </td>
            <td>
                <span class="ticket-status ${getStatusClass(ticket.status)}">
                    ${ticket.status}
                </span>
            </td>
            <td>${ticket.priority}</td>
            <td>${ticket.createdBy}</td>
            <td>${formatDate(ticket.createdAt)}</td>
            <td class="ticket-actions">
                <button class="action-btn view-ticket" data-ticket-id="${ticket.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-ticket');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketId = button.getAttribute('data-ticket-id');
            openTicketModal(parseInt(ticketId));
        });
    });
}

function renderCategoryChart() {
    const ctx = document.getElementById('categories-chart').getContext('2d');

    const categoryLabels = Object.keys(mockCategoryData).map(getCategoryLabel);
    const categoryData = Object.values(mockCategoryData);
    const categoryColors = [
        '#3498db', // Technical Support
        '#9b59b6', // Account Issues
        '#e74c3c', // Billing
        '#2ecc71', // Feature Requests
        '#f1c40f'  // Other
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: categoryData,
                backgroundColor: categoryColors,
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderTicketMessages(ticketId) {
    const messagesContainer = document.getElementById('modal-ticket-messages');
    messagesContainer.innerHTML = '';

    // Filter messages for the current ticket
    const messages = mockTicketMessages.filter(msg => msg.ticketId === ticketId);

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (message.isStaff) {
            messageDiv.classList.add('staff');
        }

        // Generate avatar URL with first letter of sender's name
        const senderName = message.sender.split('#')[0];
        const avatarColor = message.isStaff ? '5865F2' : 'e1e9fe';
        const avatarUrl = `https://ui-avatars.com/api/?name=${senderName}&background=${avatarColor}&color=fff`;

        messageDiv.innerHTML = `
            <img class="message-avatar" src="${avatarUrl}" alt="${senderName}'s avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${message.sender}</span>
                    <span class="message-time">${formatDateTime(message.createdAt)}</span>
                </div>
                <div class="message-text">${message.content}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
    });

    // Scroll to bottom of messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function populateTicketModal(ticketId) {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Set title
    document.getElementById('modal-ticket-title').textContent = `Ticket #${ticket.number} - ${ticket.title}`;

    // Set status dropdown
    const statusSelect = document.getElementById('modal-ticket-status');
    statusSelect.value = ticket.status;

    // Set priority dropdown
    const prioritySelect = document.getElementById('modal-ticket-priority');
    prioritySelect.value = ticket.priority;

    // Set category
    document.getElementById('modal-ticket-category').textContent = getCategoryLabel(ticket.category);

    // Set created date
    document.getElementById('modal-ticket-created').textContent = formatDateTime(ticket.createdAt);

    // Set creator
    document.getElementById('modal-ticket-creator').textContent = ticket.createdBy;

    // Set assignee dropdown
    const assigneeSelect = document.getElementById('modal-ticket-assignee');
    assigneeSelect.value = ticket.assignedToId || '';

    // Render messages
    renderTicketMessages(ticketId);
}

function openTicketModal(ticketId) {
    populateTicketModal(ticketId);
    document.getElementById('ticket-modal').style.display = 'block';
}

function closeTicketModal() {
    document.getElementById('ticket-modal').style.display = 'none';
}

function openNewTicketModal() {
    document.getElementById('new-ticket-modal').style.display = 'block';
}

function closeNewTicketModal() {
    document.getElementById('new-ticket-modal').style.display = 'none';
}

// ==================== Navigation Functions ====================
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const selectedPage = document.getElementById(`${pageId}-content`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update navigation
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`.sidebar-nav a[href="#${pageId}"]`).parentNode;
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Update URL hash
    window.location.hash = pageId;
}

function handleNavigation() {
    const hash = window.location.hash.substr(1) || 'dashboard';
    showPage(hash);
}

// ==================== Event Listeners ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substr(1);
            showPage(pageId);
        });
    });

    // Initialize modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn, #close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeTicketModal();
            closeNewTicketModal();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeTicketModal();
            closeNewTicketModal();
        }
    });

    // New ticket button
    document.querySelector('.new-ticket-btn').addEventListener('click', openNewTicketModal);

    // Send reply button
    document.getElementById('send-reply').addEventListener('click', () => {
        const replyText = document.getElementById('ticket-reply-box').value.trim();
        if (replyText) {
            alert('Reply functionality would be implemented with actual API calls');
            document.getElementById('ticket-reply-box').value = '';
        }
    });

    // Close ticket button
    document.getElementById('close-ticket').addEventListener('click', () => {
        alert('Close ticket functionality would be implemented with actual API calls');
        closeTicketModal();
    });

    // Create ticket button
    document.getElementById('create-ticket').addEventListener('click', () => {
        const title = document.getElementById('new-ticket-title').value.trim();
        const category = document.getElementById('new-ticket-category').value;
        const description = document.getElementById('new-ticket-description').value.trim();
        const priority = document.getElementById('new-ticket-priority').value;

        if (title && description) {
            alert('Create ticket functionality would be implemented with actual API calls');
            closeNewTicketModal();
        } else {
            alert('Please fill in all required fields');
        }
    });

    // Save settings button
    document.getElementById('save-settings').addEventListener('click', () => {
        alert('Settings saved successfully!');
    });

    // Handle browser navigation
    window.addEventListener('hashchange', handleNavigation);

    // Initialize data rendering
    renderStats();
    renderRecentTickets();
    renderAllTickets();
    renderCategoryChart();

    // Initial navigation
    handleNavigation();
});