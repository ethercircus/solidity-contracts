//testing github solidity highlighting
pragma solidity ^0.4.24;

contract UserContentRegisterInterface {
    function getUserContentBytes(address whichUser, uint256 index) public constant returns (bytes32, bytes32);
    function getNumContent(address whichUser) public returns (uint256);
}

contract TagRegister {

    struct Tag {
        string tagName;
         mapping (uint256 => address) addressIndex;
         mapping (uint256 => uint256) postIndex;
         mapping (uint256 => string) contentIndex;
         uint256 numTagged;
    }

    mapping (uint256 => Tag) public tagIndex;
    uint256 public numTags;

    mapping (string => uint256) checkTagIndexLocation;
    mapping (string => bool) _checkTagTaken;

    UserContentRegisterInterface public userContentRegister;


    constructor(address userContentRegisterAddress) public {
        userContentRegister = UserContentRegisterInterface(userContentRegisterAddress);
    }

    function createTag(string tagName) public {
        if (!_checkTagTaken[tagName]) {
            _checkTagTaken[tagName] = true;
            tagIndex[numTags] = Tag(tagName, 0);
            checkTagIndexLocation[tagName] = numTags;
            numTags++;
        }
    }

    function tagContent(string tag, uint256 contentIndex) public  {
        assert(contentIndex < userContentRegister.getNumContent(msg.sender)); //article num exists

        if (!_checkTagTaken[tag]) createTag(tag);
        uint256 whichTag = checkTagIndexLocation[tag];

        uint256 contentNumber = tagIndex[whichTag].numTagged;
        tagIndex[whichTag].addressIndex[contentNumber] = msg.sender;
        tagIndex[whichTag].postIndex[contentNumber] = contentIndex;
        var (contentOne, contentTwo) = getContentBytes(msg.sender, contentIndex);
        tagIndex[whichTag].contentIndex[contentNumber] = strConcat(bytes32ToString(contentOne), bytes32ToString(contentTwo));

        tagIndex[whichTag].numTagged++;
    }

    function checkTagTaken(string tagName) public view returns (bool) {
        return _checkTagTaken[tagName];
    }

    function getTagIndex(string tagName) public view returns (uint256) {
        return checkTagIndexLocation[tagName];
    }

    function getTagContent(string tagName, uint256 tagContentIndex) public view returns (string) {
        uint256 whichTag = checkTagIndexLocation[tagName];
        Tag storage tag = tagIndex[whichTag];
        return tag.contentIndex[tagContentIndex];
    }

    function getContentBytes(address user, uint256 contentIndex) private constant returns (bytes32, bytes32) {
        bytes32 contentOne;
        bytes32 contentTwo;
        (contentOne, contentTwo) = userContentRegister.getUserContentBytes(user, contentIndex);
        return (contentOne, contentTwo);
    }

    function strConcat(string _a, string _b) private pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
        return string(bab);
    }

    function bytes32ToString(bytes32 x) private pure returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

}
