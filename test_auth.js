const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAuth() {
  try {
    console.log('🔍 Testing Authentication Flow...\n');

    // 1. Register a new user
    console.log('1. Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Registration successful:', registerResponse.data.message);

    // 2. Login
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User data received:', loginResponse.data.user ? 'Yes' : 'No');

    const token = loginResponse.data.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 3. Test profile endpoint
    console.log('\n3. Testing profile endpoint...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, { headers });
    console.log('✅ Profile access successful:', profileResponse.data);

    // 4. Test tasks endpoint
    console.log('\n4. Testing tasks endpoint...');
    const tasksResponse = await axios.get(`${BASE_URL}/tasks`, { headers });
    console.log('✅ Tasks access successful');
    console.log('Number of tasks:', tasksResponse.data.length);

    // 5. Create a task
    console.log('\n5. Creating a test task...');
    const createTaskResponse = await axios.post(`${BASE_URL}/tasks`, {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'To Do',
      priority: 'Medium',
      due_date: '2024-12-31'
    }, { headers });
    console.log('✅ Task created successfully:', createTaskResponse.data);

    // 6. Test tasks endpoint again
    console.log('\n6. Testing tasks endpoint after creation...');
    const tasksResponse2 = await axios.get(`${BASE_URL}/tasks`, { headers });
    console.log('✅ Tasks access successful');
    console.log('Number of tasks:', tasksResponse2.data.length);

    // 7. Logout
    console.log('\n7. Testing logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/logout`, {}, { headers });
    console.log('✅ Logout successful:', logoutResponse.data.message);

    // 8. Test access after logout (should fail)
    console.log('\n8. Testing access after logout (should fail)...');
    try {
      await axios.get(`${BASE_URL}/tasks`, { headers });
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly denied access after logout:', error.response.status);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testAuth(); 