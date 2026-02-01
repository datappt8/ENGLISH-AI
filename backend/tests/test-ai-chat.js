// 测试AI聊天功能
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAIChat() {
  try {
    console.log('🧪 测试AI聊天功能\n');

    // 1. 注册用户
    console.log('1️⃣ 注册测试用户...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      username: 'aitest_' + Date.now(),
      email: `aitest_${Date.now()}@example.com`,
      password: 'Test123456'
    });
    const token = registerResponse.data.data.token;
    console.log('✅ 注册成功，获得Token\n');

    // 2. 测试AI聊天
    console.log('2️⃣ 测试AI聊天...');
    console.log('发送消息: "Hello, how are you?"');

    const chatResponse = await axios.post(
      `${API_BASE}/ai/chat`,
      {
        message: 'Hello, how are you?',
        npc_name: '村长喵喵'
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('\n✅ AI聊天成功！');
    console.log('AI回复:', chatResponse.data.data.reply);
    console.log('\n🎉 测试通过！');

  } catch (error) {
    console.error('\n❌ 测试失败');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('错误:', error.message);
    }
    process.exit(1);
  }
}

testAIChat();
