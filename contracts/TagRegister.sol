
pragma solidity ^0.4.24;

contract PublicationRegisterInterface {
    function numPublications() public returns (uint256);
    function getNumPublished(uint256 num) public returns (uint256);
    function getContentAuthor(uint256 which, uint256 num) public returns (address);
    function getAdmin(uint256 whichP) public returns (address);
    function getContentBytes(uint256 whichP, uint256 whichC) public constant returns (bytes32, bytes32);
}

contract TagRegister {

    struct ContentTag {
        uint256 publicationIndex;
        uint256 index;
        string content;
    }

    PublicationRegisterInterface public publicationRegister;
    uint256 public numTags;

    mapping (uint256 => uint256) public numContentTagsIndex;
    mapping (uint256 => mapping (uint256 => ContentTag)) public contentTagIndex;

    mapping (uint256 => uint256) public numPublicationTagsIndex;
    mapping (uint256 => mapping (uint256 => uint256)) public publicationTagIndex;

    mapping (string => uint256) checkTagIndexLocation;
    mapping (uint256 => string) public tagIndex;
    mapping (string => bool) _checkTagTaken;
    mapping (uint256 => mapping (string => bool)) private contentAlreadyTagged;
    mapping (uint256 => mapping (uint256 => bool)) public publicationAlreadyTagged;

    constructor(address publicationRegisterAddress) public {
        publicationRegister = PublicationRegisterInterface(publicationRegisterAddress);
        numTags = 1;
    }

    function createTag(string tagName) public {
        if (!_checkTagTaken[tagName]) {
            _checkTagTaken[tagName] = true;
            tagIndex[numTags] = tagName;
            checkTagIndexLocation[tagName] = numTags;
            numTags++;
        }
    }

    function tagContent(string tag, uint256 whichPublication, uint256 whichContent) public  {
        assert(whichPublication < publicationRegister.numPublications() && //publication num exists
               whichContent < publicationRegister.getNumPublished(whichPublication) && //article num exists
               msg.sender == publicationRegister.getContentAuthor(whichPublication, whichContent));// && //msg sender is author

        var (contentOne, contentTwo) = publicationRegister.getContentBytes(whichPublication, whichContent);
        var contentString = strConcat(bytes32ToString(contentOne), bytes32ToString(contentTwo));

        if (!contentAlreadyTagged[checkTagIndexLocation[tag]][contentString]) {
            if (!_checkTagTaken[tag]) createTag(tag);
            uint256 whichTag = checkTagIndexLocation[tag];
            contentTagIndex[whichTag][numContentTagsIndex[whichTag]] = ContentTag(whichPublication, whichContent,contentString);
            numContentTagsIndex[whichTag]++;
            contentAlreadyTagged[whichTag][contentString] = true;
        }
    }

    function tagPublication(string tag, uint256 whichPublication) public  {
        assert(whichPublication < publicationRegister.numPublications() &&
               msg.sender == publicationRegister.getAdmin(whichPublication) &&
               !publicationAlreadyTagged[checkTagIndexLocation[tag]][whichPublication]);

        if (!_checkTagTaken[tag]) createTag(tag);
        uint256 index = checkTagIndexLocation[tag];
        publicationTagIndex[index][numPublicationTagsIndex[index]] = whichPublication;
        numPublicationTagsIndex[index]++;
        publicationAlreadyTagged[index][whichPublication] = true;
    }

    function checkTagTaken(string tagName) public view returns (bool) {
        return _checkTagTaken[tagName];
    }

    function getTagIndex(string tagName) public view returns (uint256) {
        return checkTagIndexLocation[tagName];
    }

    function getTagContent(string tagName, uint256 tagContentIndex) public view returns (string) {
        ContentTag storage tag = contentTagIndex[checkTagIndexLocation[tagName]][tagContentIndex];
        return tag.content;
    }

    function getTagPublication(string tagName, uint256 tagPublicationIndex) public view returns (uint256) {
        return publicationTagIndex[checkTagIndexLocation[tagName]][tagPublicationIndex];
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
}
