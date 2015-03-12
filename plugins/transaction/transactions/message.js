// ..
(function () {
'use strict';
var module = angular.module('fim.base');
module.run(function (plugins, modals, $q, $rootScope, nxt) {
  
  var plugin = plugins.get('transaction');

  /**
   * Sends a message to recipient where the sender of the message can be selected 
   * from a menu or entered by hand.
   */
  plugin.add({
    label: 'Send Message',
    id: 'accountMessage',
    exclude: true,    
    execute: function (args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Send Message',
        message: 'Send an encrypted (private) message to recipient',
        requestType: 'sendMessage',
        hideMessage: true,
        editSender: true,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.recipient),
            sender: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'to_recipient',
            txnMessage: items.message
          }
        },
        fields: [{
          label: 'Recipient',
          name: 'recipient',
          type: 'text',
          value: args.recipient||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (plugin.validators.address(text) === false) { this.errorMsg = 'Invalid address'; }
            return ! this.errorMsg;
          },
          required: false,
          readonly: true
        }, {
          label: 'Message',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              if (plugin.getByteLen(text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

  /* Sends a message from a preset sender, allows the recipient to be edited */
  plugin.add({
    label: 'Send Message',
    id: 'sendMessage',
    execute: function (senderRS, args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Send Message',
        message: 'Send an encrypted (private) message to recipient',
        requestType: 'sendMessage',
        hideMessage: true,
        senderRS: senderRS,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.recipient),
            sender: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'to_recipient',
            txnMessage: items.message
          }
        },
        fields: [{
          label: 'Recipient',
          name: 'recipient',
          type: 'text',
          value: args.recipient||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (plugin.validators.address(text) === false) { this.errorMsg = 'Invalid address'; }
            return ! this.errorMsg;
          },
          required: true
        }, {
          label: 'Message',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              if (plugin.getByteLen(text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

  plugin.add({
    label: 'Leave comment',
    id: 'accountComment',
    exclude: true,
    execute: function (args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Leave Comment',
        message: 'Comments can be read by anyone and are permanantly stored in the blockchain',
        requestType: 'sendMessage',
        hideMessage: true,
        hideSender: true,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.recipient),
            sender: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'public',
            txnMessage: 'comment:' + items.message
          }
        },
        fields: [{
          label: 'Recipient',
          name: 'recipient',
          type: 'text',
          value: args.recipient||'',
          readonly: true
        }, {
          label: 'Comment',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              var _text = 'comment:' + text;
              if (plugin.getByteLen(_text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

  plugin.add({
    label: 'Write post',
    id: 'accountPost',
    execute: function (senderRS, args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Write post',
        message: 'Posts can be read by anyone and are permanantly stored in the blockchain',
        requestType: 'sendMessage',
        senderRS: senderRS,
        hideMessage: true,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'public',
            txnMessage: 'post1:' + items.message
          }
        },
        fields: [{
          label: 'Post',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              var _text = 'post1:' + text;
              if (plugin.getByteLen(_text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

  plugin.add({
    label: 'Write post',
    id: 'assetPost',
    exclude: true,
    execute: function (senderRS, args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Write post',
        message: 'Posts can be read by anyone and are permanantly stored in the blockchain',
        requestType: 'sendMessage',
        senderRS: senderRS,
        hideMessage: true,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'public',
            txnMessage: 'post2:' + args.asset + ':' + items.message
          }
        },
        fields: [{
          label: 'Post',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              var _text = 'post2:' + args.asset + ':' + text;
              if (plugin.getByteLen(_text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

  plugin.add({
    label: 'Write comment',
    id: 'writeComment',
    exclude: true,
    execute: function (args) {
      args = args||{};
      return plugin.create(angular.extend(args, {
        title: 'Write comment',
        message: 'Comments can be read by anyone and are permanantly stored in the blockchain',
        requestType: 'sendMessage',
        hideMessage: true,
        hideSender: true,
        createArguments: function (items) {
          return { 
            recipient: nxt.util.convertRSAddress(items.recipient),
            sender: nxt.util.convertRSAddress(items.senderRS),
            txnMessageType: 'public',
            txnMessage: 'comm' + args.post_transaction_id + ':' + items.message
          }
        },
        fields: [{
          label: 'Recipient',
          name: 'recipient',
          type: 'text',
          value: args.recipient||'',
          readonly: true
        }, {
          label: 'Comment',
          name: 'message',
          type: 'textarea',
          value: args.message||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) { this.errorMsg = null; }
            else {
              var _text = 'comm' + args.post_transaction_id + ':' + text;
              if (plugin.getByteLen(_text) > 1000) { this.errorMsg = 'To much characters'; }
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    }
  });

});
})();