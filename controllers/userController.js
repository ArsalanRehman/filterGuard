const Parent = require('./../models/userModels');
const authController = require('./../controllers/authController');

//get already existed user
exports.getParents = async (req, res) => {
  try {
    const newUser = await Parent.find();

    res.status(201).json({
      status: 'success',
      data: {
        User: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'failed to get All users',
      err,
    });
    console.log(err);
  }
};

//find user by id
exports.getParent = async (req, res) => {
  try {
    const newUser = await User.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        User: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'failed to get user',
      err,
    });
    console.log(err);
  }
};
//update user
exports.updateParent = async (req, res) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        User: newUser,
      },
    });
    console.log('Update Req: ', req);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'failed to update user',
      err,
    });
    console.log(err);
  }
};

exports.deleteParent = async (req, res) => {
  try {
    dpt = null;
    dpt = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'failed to delete user',
      err,
    });
    console.log(err);
  }
};

async function createDummyUser(req, res) {
  try {
    const newUser = await User.find();
    let dummyUser = false;
    for (let user of newUser) {
      if (user.name === 'superAdmin') {
        dummyUser = true;
        break;
      }
    }
    if (!dummyUser) {
      const dumyUser = new User({
        name: 'superAdmin',
        email: 'superadmin@epik.com',
        password: 'epik1234',
        passwordConfirm: 'epik1234',
        role: 'superAdmin',
      });
      await dumyUser.save();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'failed to create dummy user',
      err,
    });
  }
}

// createDummyUser();