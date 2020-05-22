import JsEncrypt from 'jsencrypt/bin/jsencrypt'
 function encodePwd(pwd){
    let jse = new JsEncrypt();
    jse.setPublicKey(
      "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpLQgQSqt9F41pmKX3rgzkrGTXsuMlJdx/ct+FvOz9EKr/nB3Nr7/aC/JamlA+Zjb1u4K9mrZTIvT9LLUSV5s6x88c7QNQrlcY1w5iz+aQo2OrXJZeEYikcRbM8/7HdzJWLypqSR9XDFCF4ePSP4juxadUB7hpGvZ5YRMZX5sW9QIDAQAB"
    );
    let password = jse.encrypt(pwd);
    return password;
}

export default{
  encodePwd
}