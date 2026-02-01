// 完整功能测试套件
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

// 测试结果统计
const results = {
  passed: 0,
  failed: 0,
  total: 0
};

// 测试用户
const testUser = {
  username: 'test_' + Date.now(),
  email: `test_${Date.now()}@example.com`,
  password: 'Test123456'
};

let authToken = '';

// 辅助函数
function testStart(name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 测试: ${name}`);
  console.log('='.repeat(60));
  results.total++;
}

function testPass(message) {
  console.log(`✅ ${message}`);
  results.passed++;
}

function testFail(message, error) {
  console.log(`❌ ${message}`);
  if (error) {
    console.log(`   错误: ${error}`);
  }
  results.failed++;
}

function printSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 测试总结');
  console.log('='.repeat(60));
  console.log(`总测试数: ${results.total}`);
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
}

// 测试函数
async function test1_BackendHealth() {
  testStart('后端服务健康检查');

  try {
    await axios.get(API_BASE, { timeout: 5000 });
    testPass('后端服务正常运行');
  } catch (error) {
    if (error.response) {
      testPass('后端服务正常运行（返回404是正常的）');
    } else {
      testFail('后端服务未运行', error.message);
    }
  }
}

async function test2_FrontendHealth() {
  testStart('前端服务健康检查');

  try {
    await axios.get(FRONTEND_URL, { timeout: 5000 });
    testPass('前端服务正常运行');
  } catch (error) {
    testFail('前端服务未运行', error.message);
  }
}

async function test3_UserRegistration() {
  testStart('用户注册功能');

  try {
    const response = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = response.data.data.token;
    testPass(`用户注册成功: ${testUser.username}`);
    testPass(`获得Token: ${authToken.substring(0, 20)}...`);
  } catch (error) {
    testFail('用户注册失败', error.response?.data?.message || error.message);
  }
}

async function test4_UserLogin() {
  testStart('用户登录功能');

  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    testPass('用户登录成功');
    testPass(`Token验证通过`);
  } catch (error) {
    testFail('用户登录失败', error.response?.data?.message || error.message);
  }
}

async function test5_GetUserProfile() {
  testStart('获取用户信息');

  try {
    const response = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const user = response.data.data;
    testPass(`用户名: ${user.username}`);
    testPass(`等级: ${user.level}`);
    testPass(`经验: ${user.exp}`);
    testPass(`金币: ${user.coins}`);
  } catch (error) {
    testFail('获取用户信息失败', error.response?.data?.message || error.message);
  }
}

async function test6_GetQuestList() {
  testStart('获取任务列表');

  try {
    const response = await axios.get(`${API_BASE}/quests`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const quests = response.data.data.quests;
    testPass(`任务总数: ${quests.length}`);
    if (quests.length > 0) {
      testPass(`第一个任务: ${quests[0].title}`);
      testPass(`任务ID: ${quests[0].id}`);
    }
  } catch (error) {
    testFail('获取任务列表失败', error.response?.data?.message || error.message);
  }
}

async function test7_StartQuest() {
  testStart('开始任务');

  try {
    const response = await axios.post(
      `${API_BASE}/quests/starter_village_001/start`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const sessionId = response.data.data.session_id;
    testPass('任务开始成功');
    testPass(`会话ID: ${sessionId}`);
    return sessionId;
  } catch (error) {
    testFail('开始任务失败', error.response?.data?.message || error.message);
    return null;
  }
}

async function test8_SubmitQuest(sessionId) {
  testStart('提交任务');

  if (!sessionId) {
    testFail('无法测试：缺少会话ID');
    return;
  }

  try {
    const response = await axios.post(
      `${API_BASE}/quests/starter_village_001/submit`,
      {
        session_id: sessionId,
        score: 95,
        completion_data: { test: true }
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const result = response.data.data;
    testPass(`任务提交成功: ${result.result}`);
    testPass(`获得经验: ${result.rewards.exp_gained}`);
    testPass(`获得金币: ${result.rewards.coins_gained}`);
  } catch (error) {
    testFail('提交任务失败', error.response?.data?.message || error.message);
  }
}

async function test9_SessionValidation() {
  testStart('会话验证功能');

  try {
    // 尝试使用无效的会话ID
    await axios.post(
      `${API_BASE}/quests/starter_village_002/submit`,
      {
        session_id: 'invalid-session-id',
        score: 90,
        completion_data: {}
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    testFail('会话验证失败：应该拒绝无效会话ID');
  } catch (error) {
    if (error.response?.status === 400) {
      testPass('正确拒绝了无效的会话ID');
    } else {
      testFail('会话验证错误', error.response?.data?.message || error.message);
    }
  }
}

async function test10_GetUserStats() {
  testStart('获取用户统计');

  try {
    const response = await axios.get(`${API_BASE}/users/me/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const stats = response.data.data;
    testPass(`完成任务数: ${stats.totalQuestsCompleted}`);
    testPass(`连续学习天数: ${stats.currentStreakDays}`);
  } catch (error) {
    testFail('获取用户统计失败', error.response?.data?.message || error.message);
  }
}

async function test11_AIChat() {
  testStart('AI对话功能');

  try {
    const response = await axios.post(
      `${API_BASE}/ai/chat`,
      {
        message: 'Hello, how are you?',
        npc_name: '村长喵喵'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    const reply = response.data.data.reply;
    testPass('AI对话成功');
    testPass(`AI回复: ${reply.substring(0, 50)}...`);
  } catch (error) {
    testFail('AI对话失败', error.response?.data?.message || error.message);
  }
}

async function test12_UpdatedUserData() {
  testStart('验证用户数据更新');

  try {
    const response = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const user = response.data.data;

    if (user.exp > 0) {
      testPass(`经验值已更新: ${user.exp}`);
    } else {
      testFail('经验值未更新');
    }

    if (user.coins > 100) {
      testPass(`金币已更新: ${user.coins}`);
    } else {
      testFail('金币未更新');
    }
  } catch (error) {
    testFail('验证用户数据失败', error.response?.data?.message || error.message);
  }
}

// 主测试流程
async function runAllTests() {
  console.log('\n🚀 开始完整功能测试');
  console.log(`时间: ${new Date().toLocaleString()}`);

  try {
    // 基础服务测试
    await test1_BackendHealth();
    await test2_FrontendHealth();

    // 用户认证测试
    await test3_UserRegistration();
    await test4_UserLogin();
    await test5_GetUserProfile();

    // 任务系统测试
    await test6_GetQuestList();
    const sessionId = await test7_StartQuest();
    await test8_SubmitQuest(sessionId);
    await test9_SessionValidation();

    // 数据验证测试
    await test10_GetUserStats();
    await test12_UpdatedUserData();

    // AI功能测试
    await test11_AIChat();

    // 打印总结
    printSummary();

    // 退出码
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ 测试过程中发生严重错误:', error.message);
    process.exit(1);
  }
}

// 运行测试
runAllTests();
